import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { DocumentLink } from '../../database/entities/DocumentLink';
import { IDocumentLinkRepository } from '../IDocumentLinkRepository';

@autoInjectable()
export class MysqlDocumentLinkRepository implements IDocumentLinkRepository {
	private readonly documentLinkClient: Repository<DocumentLink>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.documentLinkClient = this.mysqlClient.getRepository(DocumentLink);
	}
	async find(options: any): Promise<DocumentLink[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const documentLinks = await this.documentLinkClient.find({
			skip,
			take: limit,
		});

		return documentLinks;
	}

	async findById(id: string): Promise<DocumentLink> {
		const documentLink = await this.documentLinkClient.findOne({ id });

		return documentLink;
	}

	async save(documentLink: DocumentLink, manager?: EntityManager): Promise<DocumentLink> {
		let client: any = manager;
		if (!manager) {
			client = this.documentLinkClient;
		}
		const newDocumentLink = await client.save(documentLink);

		return newDocumentLink;
	}
}
