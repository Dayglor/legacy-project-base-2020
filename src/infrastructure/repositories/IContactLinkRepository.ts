import { EntityManager } from 'typeorm';

import { ContactLink } from '../database/entities/ContactLink';

export interface IContactLinkRepository {
	find(options?: any): Promise<ContactLink[]>;
	findById(id: string): Promise<ContactLink>;
	save(contactLink: ContactLink, manager?: EntityManager): Promise<ContactLink>;
}
