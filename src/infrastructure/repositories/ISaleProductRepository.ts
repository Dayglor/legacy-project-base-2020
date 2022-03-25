import { EntityManager } from 'typeorm';

import { SaleProduct } from '@infrastructure/database/entities/SaleProduct';

export interface ISaleProductRepository {
	find(options?: any): Promise<SaleProduct[]>;
	count(options?: any): Promise<number>;
	findById(id: string): Promise<SaleProduct>;
	save(sale: SaleProduct, manager?: EntityManager): Promise<SaleProduct>;
}
