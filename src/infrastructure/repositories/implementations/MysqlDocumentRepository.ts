import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { Document } from '../../database/entities/Document';
import { IDocumentRepository } from '../IDocumentRepository';

@autoInjectable()
export class MysqlDocumentRepository implements IDocumentRepository {
	private readonly documentClient: Repository<Document>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.documentClient = this.mysqlClient.getRepository(Document);
	}

	async find(options: any): Promise<Document[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const documents = await this.documentClient.find({
			skip,
			take: limit,
		});

		return documents;
	}

	async findById(id: string): Promise<Document> {
		const document = await this.documentClient.findOne({ id });

		return document;
	}

	async findByDocumentLinkId(documentLinkId: string): Promise<Document[]> {
		const documents = await this.documentClient.find({
			where: {
				document_link: <any>documentLinkId,
			},
			relations: ['document_link'],
		});

		return documents;
	}

	async save(document: Document, manager?: EntityManager): Promise<Document> {
		let client: any = manager;
		if (!client) {
			client = this.documentClient;
		}
		const newDocument = await client.save(document);

		return newDocument;
	}
}
