import parseISO from 'date-fns/parseISO';
import { autoInjectable, inject } from 'tsyringe';
import { EntityManager } from 'typeorm';

import { Contact as ContactDomain } from '@domain/Contact';
import { Client } from '@infrastructure/database/entities/Client';
import { Contact } from '@infrastructure/database/entities/Contact';
import { ContactLink } from '@infrastructure/database/entities/ContactLink';
import { IContactLinkRepository } from '@infrastructure/repositories/IContactLinkRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IContactTypeRepository } from '@infrastructure/repositories/IContactTypeRepository';
import { Utils } from '@infrastructure/utils';
import { IEditClientDTO } from '@useCases/Clients/EditClient/EditClientDTO';
import { IRegisterClientDTO } from '@useCases/Clients/RegisterClient/RegisterClientDTO';

@autoInjectable()
export class ClientFactory {
	constructor(
		@inject('IContactTypeRepository') private readonly contactTypeRepository: IContactTypeRepository,
		@inject('IContactLinkRepository') private readonly contactLinkRepository: IContactLinkRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository
	) {}

	async makeFromRegisterClientDTO(data: IRegisterClientDTO, manager?: EntityManager): Promise<Client> {
		const client = new Client();
		// const contactLink = new ContactLink();

		if (data.nationalRegistration.replace(/\D/g, '').length === 11) {
			client.company_name = data.tradingName;
		} else {
			client.company_name = data.companyName;
		}

		client.trading_name = data.tradingName;
		client.gender = data.gender;
		client.email = data.email;
		client.national_registration = data.nationalRegistration.replace(/[^\d]/g, '');
		client.birth_date = parseISO(data.birthDate);
		client.status = 'active';
		client.note = data.note;
		// client.contact_link = contactLink;
		client.user = <any>data.userId;

		if (!client.national_registration) {
			throw new Error('Client.nationalRegistration should not be empty.');
		}

		// await this.contactLinkRepository.save(contactLink, manager);

		// Utils.forEachAsync2(data.contacts, async (contact: ContactDomain) => {
		// 	const c = new Contact();
		// 	if (!contact.reference) {
		// 		if (contact.contact.replace(/\D/g, '').length === 11) {
		// 			contact.reference = 2;
		// 		} else {
		// 			contact.reference = 1;
		// 		}
		// 	}
		// 	const contactType = await this.contactTypeRepository.findByReference(contact.reference);

		// 	if (!contactType) {
		// 		throw new Error(`Contact Type Reference ${contact.reference} not found.`);
		// 	}

		// 	c.contact_link = contactLink;
		// 	c.contact_type = contactType;
		// 	c.name = contact.name;
		// 	c.contact = contact.contact.replace(/\D/g, '');

		// 	await this.contactRepository.save(c, manager);
		// });

		return client;
	}

	async makeFromEditClientDTO(data: IEditClientDTO, client: Client): Promise<Client> {
		if (data.nationalRegistration.replace(/\D/g, '').length === 11) {
			client.company_name = data.tradingName;
		} else {
			client.company_name = data.companyName;
		}

		client.trading_name = data.tradingName;
		client.gender = data.gender;
		client.email = data.email;
		client.national_registration = data.nationalRegistration.replace(/\D/g, '');
		client.birth_date = parseISO(data.birthDate);
		client.note = data.note;

		return client;
	}
}
