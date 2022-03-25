import { EntityManager } from 'typeorm';

import { Contact } from '../database/entities/Contact';

export interface IContactRepository {
	find(options?: any): Promise<Contact[]>;
	findById(id: string): Promise<Contact>;
	findByContactLinkId(contactLinkId: string): Promise<Contact[]>;
	save(contact: Contact, manager?: EntityManager): Promise<Contact>;
}
