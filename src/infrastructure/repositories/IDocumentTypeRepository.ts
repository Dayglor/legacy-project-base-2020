import { DocumentType } from '../database/entities/DocumentType';

export interface IDocumentTypeRepository {
	find(options?: any): Promise<DocumentType[]>;
	findById(id: string): Promise<DocumentType>;
	findByName(name: string): Promise<DocumentType>;
	save(documentType: DocumentType): Promise<DocumentType>;
}
