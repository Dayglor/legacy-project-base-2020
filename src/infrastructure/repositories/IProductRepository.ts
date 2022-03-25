import { EntityManager } from 'typeorm';

import { Product } from '../database/entities/Product';

export interface IProductRepository {
	find(options?: any): Promise<Product[]>;
	findById(id: string): Promise<Product>;
	findByIdsAndUserId(productsIds: string[], userId: string): Promise<Product[]>;
	save(product: Product): Promise<Product>;
	delete(id: string): Promise<void>;
	addStockById(id: string, quantity: number): Promise<Product>;
	addStockByProduct(product: Product, quantity: number): Promise<Product>;
	removeStockById(id: string, quantity: number, manager?: EntityManager): Promise<Product>;
	removeStockByProduct(product: Product, quantity: number): Promise<Product>;
	totalProducts(userId: string): Promise<number>;
}
