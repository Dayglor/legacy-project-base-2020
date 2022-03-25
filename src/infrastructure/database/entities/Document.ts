/* eslint-disable camelcase */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { DocumentLink } from './DocumentLink';
import { DocumentType } from './DocumentType';

@Entity({ name: 'documents' })
export class Document extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => DocumentLink)
	@JoinColumn({ name: 'document_link_id' })
	document_link: DocumentLink;

	@ManyToOne(() => DocumentType)
	@JoinColumn({ name: 'document_type_id' })
	document_type: DocumentType;

	@Column()
	document: string;

	@Column()
	file_name: string;

	@Column()
	mimetype: string;

	@Column()
	size: string;

	@Column()
	url: string;
}
