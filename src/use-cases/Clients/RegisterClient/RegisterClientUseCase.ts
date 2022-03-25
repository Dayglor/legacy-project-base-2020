import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Client } from '@infrastructure/database/entities/Client';
import { Contact } from '@infrastructure/database/entities/Contact';
import { ContactLink } from '@infrastructure/database/entities/ContactLink';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { AddressFactory } from '@infrastructure/factories/AddressFactory';
import { ClientFactory } from '@infrastructure/factories/ClientFactory';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';
import { IContactLinkRepository } from '@infrastructure/repositories/IContactLinkRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IContactTypeRepository } from '@infrastructure/repositories/IContactTypeRepository';
import { Utils } from '@infrastructure/utils';

import { IRegisterClientDTO } from './RegisterClientDTO';

@autoInjectable()
export class RegisterClientUseCase {
	constructor(
		@inject('IContactLinkRepository') private readonly contactLinkRepository: IContactLinkRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository,
		@inject('IContactTypeRepository') private readonly contactTypeRepository: IContactTypeRepository,
		@inject('IClientRepository') private readonly clientRepository: IClientRepository,
		@inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
		private readonly clientFactory: ClientFactory,
		private readonly addressFactory: AddressFactory
	) {}

	async execute(data: IRegisterClientDTO): Promise<Client> {
		const newAddress = await this.addressFactory.makeFromRegisterAddressDTO(data.address);
		const newClient = await this.clientFactory.makeFromRegisterClientDTO(data);

		const contactLink = new ContactLink();

		newClient.address = newAddress;
		newClient.contact_link = contactLink;

		const errors = await validate(newClient);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		data.nationalRegistration = data.nationalRegistration.replace(/[^\d]/g, '');

		const clientExists = await this.clientRepository.findByNationalRegistrationAndParentId(
			data.nationalRegistration,
			data.userId
		);

		if (clientExists && data.nationalRegistration.length === 11) {
			throw new Error('CPF já foi registrado.');
		} else if (clientExists && data.nationalRegistration.length === 14) {
			throw new Error('CNPJ já foi registrado.');
		}

		await this.contactLinkRepository.save(newClient.contact_link);

		const { contacts: contactsData } = data;

		if (contactsData) {
			Utils.forEachAsync2(contactsData, async (contact: any) => {
				const newContact = new Contact();

				newContact.contact = contact.contact.replace(/[^\d]/g, '');
				newContact.name = data.tradingName;

				Object.assign(newContact, contact);

				if (!contact.reference) {
					if (contact.contact.replace(/\D/g, '').length === 11) {
						contact.reference = 2;
					} else {
						contact.reference = 1;
					}
				}
				const contactType = await this.contactTypeRepository.findByReference(contact.reference);

				if (!contactType) {
					throw new Error(`${contact.reference} - Referência de tipo de contato não encontrado.`);
				}

				newContact.contact_type = <any>contactType;
				newContact.contact_link = newClient.contact_link;

				await this.contactRepository.save(newContact);
			});
		}

		await this.addressRepository.save(newAddress);
		// await this.contactLinkRepository.save(newClient.contact_link);

		const client = await this.clientRepository.save(newClient);

		return client;
	}
}
