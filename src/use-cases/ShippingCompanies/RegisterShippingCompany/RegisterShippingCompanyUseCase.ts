import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Contact } from '@infrastructure/database/entities/Contact';
import { ContactLink } from '@infrastructure/database/entities/ContactLink';
import { DocumentLink } from '@infrastructure/database/entities/DocumentLink';
import { ShippingCompany } from '@infrastructure/database/entities/ShippingCompany';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { AddressFactory } from '@infrastructure/factories/AddressFactory';
import { ShippingCompanyFactory } from '@infrastructure/factories/ShippingCompanyFactory';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';
import { IContactLinkRepository } from '@infrastructure/repositories/IContactLinkRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IDocumentLinkRepository } from '@infrastructure/repositories/IDocumentLinkRepository';
import { IShippingCompanyRepository } from '@infrastructure/repositories/IShippingCompanyRepository';
import { Utils } from '@infrastructure/utils';

import { IRegisterShippingCompanyDTO } from './RegisterShippingCompanyDTO';

@autoInjectable()
export class RegisterShippingCompanyUseCase {
	constructor(
		@inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
		@inject('IContactLinkRepository') private readonly contactLinkRepository: IContactLinkRepository,
		@inject('IDocumentLinkRepository') private readonly documentLinkRepository: IDocumentLinkRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository,
		@inject('IShippingCompanyRepository') private readonly shippingCompanyRepository: IShippingCompanyRepository,
		private readonly shippingCompanyFactory: ShippingCompanyFactory,
		private readonly addressFactory: AddressFactory
	) {}

	async execute(data: IRegisterShippingCompanyDTO): Promise<ShippingCompany> {
		const newAddress = await this.addressFactory.makeFromRegisterAddressDTO(data.address);
		const newShippingCompany = await this.shippingCompanyFactory.makeFromRegisterShippingCompanyDTO(data);

		const contactLink = new ContactLink();
		const documentLink = new DocumentLink();

		newShippingCompany.address = newAddress;
		newShippingCompany.contact_link = contactLink;
		newShippingCompany.document_link = documentLink;

		const errors = await validate(newShippingCompany);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		await this.contactLinkRepository.save(newShippingCompany.contact_link);
		await this.documentLinkRepository.save(newShippingCompany.document_link);

		const { contacts: contactsData } = data;

		const contacts: Contact[] = contactsData.map((contactData: any) => {
			const newContact = new Contact();
			Object.assign(newContact, contactData);
			newContact.contact_type = <any>contactData.contactTypeId;
			newContact.contact_link = newShippingCompany.contact_link;
			return newContact;
		});

		await Utils.forEachAsync2(contacts, async (contact: Contact) => {
			await this.contactRepository.save(contact);
		});

		await this.addressRepository.save(newAddress);

		const shippingCompany = await this.shippingCompanyRepository.save(newShippingCompany);

		return shippingCompany;
	}
}
