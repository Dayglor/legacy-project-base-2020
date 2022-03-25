/* eslint-disable @typescript-eslint/no-unused-vars */
import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { SaleProduct } from '@infrastructure/database/entities/SaleProduct';

import { ISaleProductRepository } from '../ISaleProductRepository';

@autoInjectable()
export class MysqlSaleProductRepository implements ISaleProductRepository {
	private readonly saleProductClient: Repository<SaleProduct>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.saleProductClient = this.mysqlClient.getRepository(SaleProduct);
	}
	find(options?: any): Promise<SaleProduct[]> {
		throw new Error('Method find not implemented.');
	}
	count(options?: any): Promise<number> {
		throw new Error('Method count not implemented.');
	}
	findById(id: string): Promise<SaleProduct> {
		throw new Error('Method find by id not implemented.');
	}
	async save(sale: SaleProduct, manager?: EntityManager): Promise<SaleProduct> {
		let client: any = manager;
		if (!client) {
			client = this.saleProductClient;
		}
		const saleProduct = await client.save(sale);

		return saleProduct;
		// throw new Error('Method not implemented.');
	}
}
