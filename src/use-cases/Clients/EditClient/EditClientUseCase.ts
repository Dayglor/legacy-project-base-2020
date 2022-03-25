import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Client } from '@infrastructure/database/entities/Client';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { AddressFactory } from '@infrastructure/factories/AddressFactory';
import { ClientFactory } from '@infrastructure/factories/ClientFactory';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';

import { IEditClientDTO } from './EditClientDTO';

@autoInjectable()
export class EditClientUseCase {
	constructor(
		@inject('IClientRepository') private readonly clientRepository: IClientRepository,
		@inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository,
		private readonly clientFactory: ClientFactory,
		private readonly addressFactory: AddressFactory
	) {}

	async execute(data: IEditClientDTO): Promise<Client> {
		let client = await this.clientRepository.findById(data.id);

		if (!client) {
			throw Error('Não encontrado');
		}

		const address = await this.addressRepository.findById(client.address.id);
		const editedAddress = await this.addressFactory.makeFromEditAddressDTO(data.address, address);

		const editedClient = await this.clientFactory.makeFromEditClientDTO(data, client);

		const errors = await validate(editedClient);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		const { contacts: contactsData } = data;

		const contact = await this.contactRepository.findByContactLinkId(client.contact_link.id);

		const newContact = contact[0];

		newContact.name = client.trading_name;
		newContact.contact = contactsData[0].contact.replace(/\D/g, '');

		await this.addressRepository.save(editedAddress);
		await this.contactRepository.save(newContact);
		await this.clientRepository.save(editedClient);

		client = await this.clientRepository.findById(data.id);

		return client;
	}
}
