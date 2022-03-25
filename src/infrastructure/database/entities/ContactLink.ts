import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Contact } from './Contact';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'contacts_links' })
export class ContactLink extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@OneToMany(() => Contact, (contact) => contact.contact_link)
	contact: Contact[];
}
