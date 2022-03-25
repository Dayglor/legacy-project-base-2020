import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { DocumentType } from '../../database/entities/DocumentType';
import { IDocumentTypeRepository } from '../IDocumentTypeRepository';

@autoInjectable()
export class MysqlDocumentTypeRepository implements IDocumentTypeRepository {
	private readonly documentTypeClient: Repository<DocumentType>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.documentTypeClient = this.mysqlClient.getRepository(DocumentType);
	}
	async find(options: any): Promise<DocumentType[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const documentTypes = await this.documentTypeClient.find({
			skip,
			take: limit,
		});

		return documentTypes;
	}

	async findById(id: string): Promise<DocumentType> {
		const documentType = await this.documentTypeClient.findOne({ id });

		return documentType;
	}

	async findByName(name: string): Promise<DocumentType> {
		const documentType = await this.documentTypeClient.findOne({ name });

		return documentType;
	}

	async save(documentType: DocumentType): Promise<DocumentType> {
		const newDocumentType = await this.documentTypeClient.save(documentType);

		return newDocumentType;
	}
}
