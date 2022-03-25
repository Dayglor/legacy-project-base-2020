import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { Receivable } from '../../database/entities/Receivable';
import { IReceivableRepository } from '../IReceivableRepository';

@autoInjectable()
export class MysqlReceivableRepository implements IReceivableRepository {
	private readonly receivableClient: Repository<Receivable>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.receivableClient = this.mysqlClient.getRepository(Receivable);
	}
	async find(options: any): Promise<Receivable[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const receivables = await this.receivableClient.find({
			skip,
			take: limit,
		});

		return receivables;
	}

	async findById(id: string): Promise<Receivable> {
		const receivable = await this.receivableClient.findOne(
			{
				id,
			},
			{
				relations: ['payment', 'payment.sale'],
			}
		);

		return receivable;
	}

	async save(receivable: Receivable, manager?: EntityManager): Promise<Receivable> {
		let client: any = manager;
		if (!client) {
			client = this.receivableClient;
		}
		const newReceivable = await client.save(receivable);

		return newReceivable;
	}
}
