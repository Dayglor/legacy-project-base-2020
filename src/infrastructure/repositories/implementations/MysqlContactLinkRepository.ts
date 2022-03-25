import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { ContactLink } from '../../database/entities/ContactLink';
import { IContactLinkRepository } from '../IContactLinkRepository';

@autoInjectable()
export class MysqlContactLinkRepository implements IContactLinkRepository {
	private readonly contactLinkClient: Repository<ContactLink>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.contactLinkClient = this.mysqlClient.getRepository(ContactLink);
	}
	async find(options: any): Promise<ContactLink[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const contactLinks = await this.contactLinkClient.find({
			skip,
			take: limit,
		});

		return contactLinks;
	}

	async findById(id: string): Promise<ContactLink> {
		const contactLink = await this.contactLinkClient.findOne({ id });

		return contactLink;
	}

	async save(contactLink: ContactLink, manager?: EntityManager): Promise<ContactLink> {
		let client: any = manager;
		if (!client) {
			client = this.contactLinkClient;
		}
		const newContactLink = await client.save(contactLink);

		return newContactLink;
	}
}
