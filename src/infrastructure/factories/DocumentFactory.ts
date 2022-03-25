import { autoInjectable } from 'tsyringe';

import { Document } from '@infrastructure/database/entities/Document';

export interface IRegisterDocumentDTO {
	documentTypeId: string;
	document: string;
	fileName: string;
	mimetype: string;
	size: string;
	url: string;
}

export interface IRegisterDocumentFromDTO {
	documents: IRegisterDocumentDTO[];
	documentLinkId: string;
}

@autoInjectable()
export class DocumentFactory {
	makeFromRegisterDocumentArray(data: IRegisterDocumentFromDTO): Document[] {
		const { documents, documentLinkId } = data;

		const newDocuments: Document[] = documents.map((document: any) => {
			const newDocument = new Document();
			// Object.assign(newDocument, document);
			newDocument.url = document.path;
			newDocument.document = document.fieldName;
			newDocument.file_name = document.name;
			newDocument.mimetype = document.type;
			newDocument.size = document.size;
			newDocument.document_type = <any>document.documentTypeId;
			newDocument.document_link = <any>documentLinkId;
			return newDocument;
		});

		return newDocuments;
	}
}
