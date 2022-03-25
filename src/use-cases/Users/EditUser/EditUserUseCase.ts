import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { AddressFactory } from '@infrastructure/factories/AddressFactory';
import { UserBankFactory } from '@infrastructure/factories/UserBankFactory';
import { UserFactory } from '@infrastructure/factories/UserFactory';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IUserBankRepository } from '@infrastructure/repositories/IUserBankRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';

import { IEditUserDTO } from './EditUserDTO';

@autoInjectable()
export class EditUserUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository,
		@inject('IUserBankRepository') private readonly userBankRepository: IUserBankRepository,
		private readonly userFactory: UserFactory,
		private readonly addressFactory: AddressFactory,
		private readonly userBankFactory: UserBankFactory
	) {}

	async execute(data: IEditUserDTO): Promise<User> {
		const { userId } = data || {};

		let user = await this.userRepository.findById(userId);

		const validateNationalRegistration = user.national_registration;
		const validateEmail = user.email;

		const address = await this.addressRepository.findById(user.address.id);
		const editedAddress = await this.addressFactory.makeFromEditAddressDTO(data.address, address);

		data.userBank.bank = data.bank;
		const userBank = await this.userBankRepository.findByUserId(data.userId);

		let editedUserBank;

		if (data.userBank.agency !== '') {
			if (userBank) {
				editedUserBank = await this.userBankFactory.makeFromEditUserBankDTO(data.userBank, userBank);
			} else {
				data.userBank.user = userId;
				editedUserBank = await this.userBankFactory.makeFromRegisterUserBank(data.userBank);
			}
		}

		const editedUser = await this.userFactory.makeFromEditUserDTO(data, user);

		const errors = await validate(editedUser);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		const emailAlreadyExists = await this.userRepository.findByEmail(editedUser.email);

		if (emailAlreadyExists && editedUser.email !== validateEmail) {
			throw new Error('E-mail já foi registrado.');
		}

		const nationalRegistrationAlreadyExists = await this.userRepository.findByNationalRegistration(
			editedUser.national_registration
		);

		if (nationalRegistrationAlreadyExists && editedUser.national_registration !== validateNationalRegistration) {
			throw new Error('CPF/CNPJ já foi registrado.');
		}

		const { contacts: contactsData } = data;

		Utils.forEachAsync2(contactsData, async (contact: any) => {
			if (contact) {
				const editedContact = await this.contactRepository.findById(contact.id);
				editedContact.contact = contact.contact.replace(/\D/g, '');
				await this.contactRepository.save(editedContact);
			}
		});

		await this.addressRepository.save(editedAddress);

		if (editedUserBank) {
			await this.userBankRepository.save(editedUserBank);
		}
		await this.userRepository.save(editedUser);

		user = await this.userRepository.findById(userId);

		return user;
	}
}
