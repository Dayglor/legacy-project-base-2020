import { EntityManager } from 'typeorm';

import { Document } from '../database/entities/Document';

export interface IDocumentRepository {
	find(options?: any): Promise<Document[]>;
	findById(id: string): Promise<Document>;
	findByDocumentLinkId(documentLinkId: string): Promise<Document[]>;
	save(document: Document, manager?: EntityManager): Promise<Document>;
}
