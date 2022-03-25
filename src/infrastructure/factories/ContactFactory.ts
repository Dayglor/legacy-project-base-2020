import { autoInjectable, inject } from 'tsyringe';

import { Contact } from '@infrastructure/database/entities/Contact';
import { IContactTypeRepository } from '@infrastructure/repositories/IContactTypeRepository';

export interface IRegisterContactDTO {
	contactTypeId: string;
	name: string;
	contact: string;
}

export interface IRegisterContactFromDTO {
	contacts: IRegisterContactDTO[];
	contactLinkId: string;
}

@autoInjectable()
export class ContactFactory {
	constructor(@inject('IContactTypeRepository') private readonly contactTypeRepository: IContactTypeRepository) {}
	async makeFromRegisterContactArray(data: IRegisterContactFromDTO): Promise<Contact[]> {
		const { contacts, contactLinkId } = data;

		const cellphoneContactType = await this.contactTypeRepository.findByName('Celular');
		const telephoneContactType = await this.contactTypeRepository.findByName('Telefone');

		const newContacts: Contact[] = [];
		contacts.forEach((contact: any) => {
			if (contact.contact) {
				// 	return false;
				// }
				const newContact = new Contact();
				Object.assign(newContact, contact);
				newContact.contact = contact.contact.replace(/\D/g, '');

				if (contact.contact.replace(/\D/g, '').length === 11) {
					newContact.contact_type = cellphoneContactType;
				} else {
					newContact.contact_type = telephoneContactType;
				}

				newContact.contact_link = <any>contactLinkId;
				newContacts.push(newContact);
			}
		});

		return newContacts;
	}
}
