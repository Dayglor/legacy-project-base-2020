import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { Address } from '../../database/entities/Address';
import { IAddressRepository } from '../IAddressRepository';

@autoInjectable()
export class MysqlAddressRepository implements IAddressRepository {
	private readonly addressClient: Repository<Address>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.addressClient = this.mysqlClient.getRepository(Address);
	}
	async find(options: any): Promise<Address[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const addresses = await this.addressClient.find({
			skip,
			take: limit,
		});

		return addresses;
	}

	async findById(id: string): Promise<Address> {
		const address = await this.addressClient.findOne({ id });

		return address;
	}

	async save(address: Address, manager?: EntityManager): Promise<Address> {
		let client: any = manager;
		if (!client) {
			client = this.addressClient;
		}
		const newAddress = await client.save(address);

		return newAddress;
	}
}
