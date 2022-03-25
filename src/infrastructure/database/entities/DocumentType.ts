import { Column, Entity, PrimaryColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'documents_types' })
export class DocumentType extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	reference: number;

	@Column()
	name: string;
}
