/* eslint-disable camelcase */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ContactLink } from './ContactLink';
import { ContactType } from './ContactType';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'contacts' })
export class Contact extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => ContactLink)
	@JoinColumn({ name: 'contact_link_id' })
	contact_link: ContactLink;

	@ManyToOne(() => ContactType)
	@JoinColumn({ name: 'contact_type_id' })
	contact_type: ContactType;

	@Column()
	name: string;

	@Column()
	contact: string;
}
