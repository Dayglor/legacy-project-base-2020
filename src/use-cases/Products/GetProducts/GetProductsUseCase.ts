import { autoInjectable, inject } from 'tsyringe';

import { Product } from '@infrastructure/database/entities/Product';
import { IProductRepository } from '@infrastructure/repositories/IProductRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IGetProductsDTO } from './GetProductsDTO';

@autoInjectable()
export class GetProductsUseCase {
	constructor(
		@inject('IProductRepository') private readonly productsRepository: IProductRepository,
		@inject('IUserRepository') private readonly userRepository: IUserRepository
	) {}

	async execute(filter?: IGetProductsDTO): Promise<Product[]> {
		const { limit, page, searchByName, userId } = filter || {};

		const user = await this.userRepository.findById(userId);
		const parentId = user.parent?.id ? user.parent.id : null;

		const products = await this.productsRepository.find({ limit, page, searchByName, userId, parentId });

		return products;
	}
}
