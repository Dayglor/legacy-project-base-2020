import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Document } from './Document';

@Entity({ name: 'documents_links' })
export class DocumentLink extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@OneToMany(() => Document, (document) => document.document_link)
	document: Document[];
}
