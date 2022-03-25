import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, In, Like, Repository } from 'typeorm';

import { Product } from '../../database/entities/Product';
import { IProductRepository } from '../IProductRepository';

@autoInjectable()
export class MysqlProductRepository implements IProductRepository {
	private readonly productClient: Repository<Product>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.productClient = this.mysqlClient.getRepository(Product);
	}
	async find(options: any): Promise<Product[]> {
		const { limit, page, searchByName, userId, parentId } = options;
		const skip = (+page - 1) * +limit;

		const where: any = {};

		if (userId) {
			where.user = userId;
		}

		if (userId && parentId) {
			where.user = In([userId, parentId]);
		}

		if (searchByName) {
			where.name = Like(`%${searchByName}%`);
		}

		const products = await this.productClient.find({
			where,
			relations: ['product_category'],
			skip,
			take: limit,
			order: {
				created: 'DESC',
			},
		});

		return products;
	}

	async findById(id: string): Promise<Product> {
		const product = await this.productClient.findOne({ id }, { relations: ['product_category'] });

		return product;
	}

	async findByIdsAndUserId(productsIds: string[], userId: string): Promise<Product[]> {
		const products = await this.productClient.find({
			where: {
				id: In(productsIds),
				user: <any>userId,
			},
		});

		return products;
	}

	async save(product: Product): Promise<Product> {
		const newProduct = await this.productClient.save(product);

		return newProduct;
	}

	async delete(id: string): Promise<void> {
		await this.productClient.softDelete({ id });
	}

	async addStockById(id: string, quantity: number): Promise<Product> {
		const product = await this.productClient.findOne({ id });

		if (!product) {
			throw new Error(`Product ${id} not found.`);
		}

		product.stock_quantity += quantity;

		await this.productClient.save(product);

		return product;
	}

	async addStockByProduct(product: Product, quantity: number): Promise<Product> {
		product.stock_quantity += quantity;

		await this.productClient.save(product);

		return product;
	}

	async removeStockById(id: string, quantity: number, manager?: EntityManager): Promise<Product> {
		let client: any = manager;
		if (!client) {
			client = this.productClient;
		}
		const product = await this.productClient.findOne({ id });

		if (!product) {
			throw new Error(`Product ${id} not found.`);
		}

		if (product.stock && quantity > product.stock_quantity) {
			throw new Error('quantity is higher than stock.');
		}

		product.stock_quantity -= quantity;

		await client.save(product);

		return product;
	}

	async removeStockByProduct(product: Product, quantity: number): Promise<Product> {
		// if (quantity > product.stock_quantity) {
		// 	throw new Error('quantity is higher than stock.');
		// }

		product.stock_quantity -= quantity;

		await this.productClient.save(product);

		return product;
	}

	async totalProducts(userId: string): Promise<number> {
		const products = await this.productClient.count({ user: <any>userId });

		return products;
	}
}
