import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { SaleType } from '../../database/entities/SaleType';
import { ISaleTypeRepository } from '../ISaleTypeRepository';

@autoInjectable()
export class MysqlSaleTypeRepository implements ISaleTypeRepository {
	private readonly saleTypeClient: Repository<SaleType>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.saleTypeClient = this.mysqlClient.getRepository(SaleType);
	}
	async find(options: any): Promise<SaleType[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const saleTypes = await this.saleTypeClient.find({
			skip,
			take: limit,
		});

		return saleTypes;
	}

	async findById(id: string): Promise<SaleType> {
		const saleType = await this.saleTypeClient.findOne({ id });

		return saleType;
	}

	async findByReference(reference: number): Promise<SaleType> {
		const saleType = await this.saleTypeClient.findOne({ reference });

		return saleType;
	}

	async save(saleType: SaleType): Promise<SaleType> {
		const newSaleType = await this.saleTypeClient.save(saleType);

		return newSaleType;
	}
}
