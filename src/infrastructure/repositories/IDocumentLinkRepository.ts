import { EntityManager } from 'typeorm';

import { DocumentLink } from '../database/entities/DocumentLink';

export interface IDocumentLinkRepository {
	find(options?: any): Promise<DocumentLink[]>;
	findById(id: string): Promise<DocumentLink>;
	save(documentLink: DocumentLink, manager?: EntityManager): Promise<DocumentLink>;
}
