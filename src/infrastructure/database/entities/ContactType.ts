import { Column, Entity, PrimaryColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'contacts_types' })
export class ContactType extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	reference: number;

	@Column()
	name: string;
}
