import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { Contact } from '../../database/entities/Contact';
import { IContactRepository } from '../IContactRepository';

@autoInjectable()
export class MysqlContactRepository implements IContactRepository {
	private readonly contactClient: Repository<Contact>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.contactClient = this.mysqlClient.getRepository(Contact);
	}
	async find(options: any = { limit: 10, page: 1 }): Promise<Contact[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const contacts = await this.contactClient.find({
			skip,
			take: limit,
		});

		return contacts;
	}

	async findById(id: string): Promise<Contact> {
		const contact = await this.contactClient.findOne({ id });

		return contact;
	}

	async findByContactLinkId(contactLinkId: string): Promise<Contact[]> {
		const contacts = await this.contactClient.find({
			where: {
				contact_link: <any>contactLinkId,
			},
			relations: ['contact_link'],
		});

		return contacts;
	}

	async save(contact: Contact, manager?: EntityManager): Promise<Contact> {
		let client: any = manager;
		if (!client) {
			client = this.contactClient;
		}
		const newContact = await client.save(contact);

		return newContact;
	}
}
