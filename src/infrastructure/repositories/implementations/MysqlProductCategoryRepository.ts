import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository } from 'typeorm';

import { ProductCategory } from '@infrastructure/database/entities/ProductCategory';

import { IProductCategoryRepository } from '../IProductCategoryRepository';

@autoInjectable()
export class MysqlProductCategoryRepository implements IProductCategoryRepository {
	private readonly productCategoryClient: Repository<ProductCategory>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.productCategoryClient = this.mysqlClient.getRepository(ProductCategory);
	}
	async find(options: any): Promise<ProductCategory[]> {
		// const { title } = options.query;
		const { limit, page, title, userId } = options;
		const skip = (+page - 1) * +limit;

		const where: any = {};

		// console.log(userId);
		if (userId) {
			where.user = <any>userId;
		}

		if (title) {
			where.title = Like(`%${title}%`);
		}

		const categories = await this.productCategoryClient.find({
			where,
			skip,
			take: limit,
			order: {
				title: 'ASC',
			},
		});

		return categories;
	}

	async findById(id: string): Promise<ProductCategory> {
		const category = await this.productCategoryClient.findOne({ id });

		return category;
	}

	async save(productCategory: ProductCategory): Promise<ProductCategory> {
		const newCategory = await this.productCategoryClient.save(productCategory);

		return newCategory;
	}

	async delete(id: string): Promise<void> {
		await this.productCategoryClient.softDelete({ id });
	}
}
