import { autoInjectable, inject } from 'tsyringe';

import { ProductCategory } from '@infrastructure/database/entities/ProductCategory';
import { IProductCategoryRepository } from '@infrastructure/repositories/IProductCategoryRepository';

import { IGetCategoriesDTO } from './GetCategoriesDTO';

@autoInjectable()
export class GetCategoriesUseCase {
	constructor(
		@inject('IProductCategoryRepository') private readonly productCategoryRepository: IProductCategoryRepository
	) {}

	async execute(data: IGetCategoriesDTO): Promise<ProductCategory[]> {
		const categories = await this.productCategoryRepository.find(data);

		return categories;
	}
}
