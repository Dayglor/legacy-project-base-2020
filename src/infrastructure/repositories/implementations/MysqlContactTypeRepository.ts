import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { ContactType } from '../../database/entities/ContactType';
import { IContactTypeRepository } from '../IContactTypeRepository';

@autoInjectable()
export class MysqlContactTypeRepository implements IContactTypeRepository {
	private readonly contactTypeClient: Repository<ContactType>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.contactTypeClient = this.mysqlClient.getRepository(ContactType);
	}
	async find(options: any): Promise<ContactType[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const contactTypes = await this.contactTypeClient.find({
			skip,
			take: limit,
		});

		return contactTypes;
	}

	async findById(id: string): Promise<ContactType> {
		const contactType = await this.contactTypeClient.findOne({ id });

		return contactType;
	}

	async findByReference(reference: number): Promise<ContactType> {
		const contactType = await this.contactTypeClient.findOne({ reference });

		return contactType;
	}

	async findByName(name: string): Promise<ContactType> {
		const contactType = await this.contactTypeClient.findOne({ name });

		return contactType;
	}

	async save(contactType: ContactType): Promise<ContactType> {
		const newContactType = await this.contactTypeClient.save(contactType);

		return newContactType;
	}
}
