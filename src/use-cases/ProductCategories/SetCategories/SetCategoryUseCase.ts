import { autoInjectable, inject } from 'tsyringe';

import { ProductCategory } from '@infrastructure/database/entities/ProductCategory';
import { ProductCategoryFactory } from '@infrastructure/factories/ProductCategoryFactory';
import { IProductCategoryRepository } from '@infrastructure/repositories/IProductCategoryRepository';

import { ISetCategoriesDTO } from './SetCategoriesDTO';

@autoInjectable()
export class SetCategoryUseCase {
	constructor(
		@inject('IProductCategoryRepository') private readonly productCategoryRepository: IProductCategoryRepository,
		private readonly productCategoryFactory: ProductCategoryFactory
	) {}

	async execute(data: ISetCategoriesDTO): Promise<ProductCategory> {
		const newProductCategory = await this.productCategoryFactory.makeFromProductCategorytDTO(data);

		const newCategory = await this.productCategoryRepository.save(newProductCategory);

		return newCategory;
	}
}
