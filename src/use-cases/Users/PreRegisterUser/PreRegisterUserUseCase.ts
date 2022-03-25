import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';
import fs from 'fs';

import { Contact } from '@infrastructure/database/entities/Contact';
import { ContactLink } from '@infrastructure/database/entities/ContactLink';
import { Document } from '@infrastructure/database/entities/Document';
import { DocumentLink } from '@infrastructure/database/entities/DocumentLink';
import { User } from '@infrastructure/database/entities/User';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { IAWSS3 } from '@infrastructure/external-providers/aws/IAWSS3Provider';
import { AddressFactory } from '@infrastructure/factories/AddressFactory';
import { ContactFactory } from '@infrastructure/factories/ContactFactory';
import { DocumentFactory } from '@infrastructure/factories/DocumentFactory';
import { MajorityMemberFactory } from '@infrastructure/factories/MajorityMemberFactory';
import { UserBankFactory } from '@infrastructure/factories/UserBankFactory';
import { UserFactory } from '@infrastructure/factories/UserFactory';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';
import { IContactLinkRepository } from '@infrastructure/repositories/IContactLinkRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IDocumentLinkRepository } from '@infrastructure/repositories/IDocumentLinkRepository';
import { IDocumentRepository } from '@infrastructure/repositories/IDocumentRepository';
import { IMajorityMemberRepository } from '@infrastructure/repositories/IMajorityMemberRepository';
import { IUserBankRepository } from '@infrastructure/repositories/IUserBankRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';

import { IPreRegisterUserDTO } from './PreRegisterUserDTO';
import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { IMailProvider } from '@infrastructure/external-providers/mail/IMailProvider';

@autoInjectable()
export class PreRegisterUserUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
		@inject('IUserBankRepository') private readonly userBankRepository: IUserBankRepository,
		@inject('IContactLinkRepository') private readonly contactLinkRepository: IContactLinkRepository,
		@inject('IDocumentLinkRepository') private readonly documentLinkRepository: IDocumentLinkRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository,
		@inject('IDocumentRepository') private readonly documentRepository: IDocumentRepository,
		@inject('IMajorityMemberRepository') private readonly majorityMemberRepository: IMajorityMemberRepository,
		@inject('AWS-S3') private readonly S3: IAWSS3,
		@inject('IMailProvider') private readonly mailProvider: IMailProvider,
		private readonly userFactory: UserFactory,
		private readonly addressFactory: AddressFactory,
		private readonly majorityMemberFactory: MajorityMemberFactory,
		private readonly contactFactory: ContactFactory,
		private readonly documentFactory: DocumentFactory,
		private readonly userBankFactory: UserBankFactory,
		private readonly zspayPaymentGateway: ZspayPaymentGatewayProvider,
	) {}

	async execute(data: IPreRegisterUserDTO): Promise<User> {
		const userAddress = await this.addressFactory.makeFromRegisterAddressDTO(data.address);
		const newUser = await this.userFactory.makeFromPreRegisterUserDTO(data);

		const contactLink = new ContactLink();
		const documentLink = new DocumentLink();

		newUser.address = userAddress;
		newUser.contact_link = contactLink;
		newUser.document_link = documentLink;

		const errors = await validate(newUser);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		const emailAlreadyExists = await this.userRepository.findByEmail(newUser.email);

		if (emailAlreadyExists) {
			throw new Error('E-mail já foi registrado.');
		}

		const nationalRegistrationAlreadyExists = await this.userRepository.findByNationalRegistration(
			newUser.national_registration
		);

		if (nationalRegistrationAlreadyExists) {
			throw new Error('CPF/CNPJ já foi registrado.');
		}

		await this.contactLinkRepository.save(newUser.contact_link);
		await this.documentLinkRepository.save(newUser.document_link);

		// const { contacts: contactsData, documents: documentsData } = data;
		const { contacts: contactsData } = data;

		let documentsData = [];
		if (data.logo) {
			documentsData.push(data.logo);
		}

		if (data.comprovanteEndereco) {
			documentsData.push(data.comprovanteEndereco);
		}

		if (data.cnh) {
			documentsData.push(data.cnh);
		}

		if (data.contratoSocial) {
			documentsData.push(data.contratoSocial);
		}

		const userContacts: Contact[] = await this.contactFactory.makeFromRegisterContactArray({
			contacts: contactsData ?? [],
			contactLinkId: newUser.contact_link.id,
		});

		const userDocuments: Document[] = this.documentFactory.makeFromRegisterDocumentArray({
			documents: documentsData ?? [],
			documentLinkId: newUser.document_link.id,
		});

		const { majorityMember } = data;
		let newMajorityMember = null;

		if (majorityMember) {
			// Majority Member
			const majorityMemberAddress = await this.addressFactory.makeFromRegisterAddressDTO(majorityMember.address);
			newMajorityMember = this.majorityMemberFactory.makeFromPreRegisterMajorityMemberDTO(majorityMember);

			const majorityMemberContactLink = new ContactLink();
			const majorityMemberDocumentLink = new DocumentLink();

			newMajorityMember.address = majorityMemberAddress;
			newMajorityMember.contact_link = majorityMemberContactLink;
			newMajorityMember.document_link = majorityMemberDocumentLink;

			await this.contactLinkRepository.save(newMajorityMember.contact_link);
			await this.documentLinkRepository.save(newMajorityMember.document_link);

			newMajorityMember.user = newUser;

			const newMajorityMemberErrors = await validate(newMajorityMember);

			if (newMajorityMemberErrors.length > 0) {
				throw new EnhancedError(
					'Validation error.',
					newMajorityMemberErrors
						.map((e) => Object.values(e.constraints))
						.join()
						.split(',')
				);
			}
		}

		const majorityMemberContacts: Contact[] = await this.contactFactory.makeFromRegisterContactArray({
			contacts: majorityMember?.contacts ?? [],
			contactLinkId: newMajorityMember?.contact_link?.id ?? '',
		});

		const majorityMemberDocuments: Document[] = this.documentFactory.makeFromRegisterDocumentArray({
			documents: majorityMember?.documents ?? [],
			documentLinkId: newMajorityMember?.document_link?.id ?? '',
		});

		const contacts = [...userContacts, ...majorityMemberContacts];
		const documents = [...userDocuments, ...majorityMemberDocuments];

		await Utils.forEachAsync2(contacts, async (contact: Contact) => {
			await this.contactRepository.save(contact);
		});

		await Utils.forEachAsync2(documents, async (document: Document) => {
			await this.documentRepository.save(document);
		});

		// await Utils.forEachAsync2(documents, async (document: Document) => {
		// 	// Send to S3
		// 	let s3File = null;
		// 	if (document.document === 'logo') {
		// 		s3File = await this.S3.upload({
		// 			Body: fs.readFileSync(document.url),
		// 			Bucket: 'consultores-bucket',
		// 			ContentType: document.mimetype,
		// 			Key: `files/users/logos/${Date.now()}_${document.file_name}`,
		// 		});
		// 	} else {
		// 		s3File = await this.S3.upload({
		// 			Body: fs.readFileSync(document.url),
		// 			Bucket: 'consultores-bucket',
		// 			ContentType: document.mimetype,
		// 			Key: `files/users/documentos/${Date.now()}_${document.file_name}`,
		// 		});
		// 	}

		// 	document.url = s3File.Location;
		// 	await this.documentRepository.save(document);
		// });

		await this.addressRepository.save(newUser.address);
		await this.userRepository.save(newUser);

		if (majorityMember) {
			await this.addressRepository.save(newMajorityMember.address);
			await this.majorityMemberRepository.save(newMajorityMember);
		}

		if (data.userBankAccount?.bank) {
			data.userBankAccount.user = newUser;
			// data.userBankAccount.accountNumber = data.userBankAccount.account_number;
			const newUserBank = await this.userBankFactory.makeFromRegisterUserBank(data.userBankAccount);
			await this.userBankRepository.save(newUserBank);
		}

		const user = await this.userRepository.findPreRegisterById(newUser.id);

		let ecZspay: any = user;

		const ec = await this.zspayPaymentGateway.registerEC(ecZspay);

		user.zspay_id = ec?.id;
		
		await this.userRepository.save(user);

		await Utils.forEachAsync2(user.document_link.document, async (document: Document) => {
			// Send to S3
			let s3File = null;
			if (document.document === 'logo') {
				s3File = await this.S3.upload({
					Body: fs.readFileSync(document.url),
					Bucket: 'consultores-bucket',
					ContentType: document.mimetype,
					Key: `files/users/logos/${Date.now()}_${document.file_name}`,
				});
			} else {
				s3File = await this.S3.upload({
					Body: fs.readFileSync(document.url),
					Bucket: 'consultores-bucket',
					ContentType: document.mimetype,
					Key: `files/users/documentos/${Date.now()}_${document.file_name}`,
				});
			}

			document.url = s3File.Location;
			await this.documentRepository.save(document);
		});

		const PreRegisterMailData = {
			name: user.trading_name,
			email: user.email,
		};

		await this.mailProvider.sendPreRegisterMail(PreRegisterMailData);

		return user;
	}
}
