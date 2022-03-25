import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { SaleCommission } from '../../database/entities/SaleCommission';
import { ISaleCommissionRepository } from '../ISaleCommissionRepository';

@autoInjectable()
export class MysqlSaleCommissionRepository implements ISaleCommissionRepository {
	private readonly saleCommissionClient: Repository<SaleCommission>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.saleCommissionClient = this.mysqlClient.getRepository(SaleCommission);
	}
	async find(options: any): Promise<SaleCommission[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const saleCommissions = await this.saleCommissionClient.find({
			skip,
			take: limit,
		});

		return saleCommissions;
	}

	async findById(id: string): Promise<SaleCommission> {
		const saleCommission = await this.saleCommissionClient.findOne({ id });

		return saleCommission;
	}

	async save(saleCommission: SaleCommission, manager?: EntityManager): Promise<SaleCommission> {
		let client: any = manager;
		if (!client) {
			client = this.saleCommissionClient;
		}
		const newSaleCommission = await client.save(saleCommission);

		return newSaleCommission;
	}
}
