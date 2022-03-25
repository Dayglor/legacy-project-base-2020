import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Product } from '@infrastructure/database/entities/Product';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { ProductFactory } from '@infrastructure/factories/ProductFactory';
import { IProductRepository } from '@infrastructure/repositories/IProductRepository';

import { IEditProductDTO } from './EditProductDTO';

@autoInjectable()
export class EditProductUseCase {
	constructor(
		@inject('IProductRepository') private readonly productRepository: IProductRepository,
		private readonly productFactory: ProductFactory
	) {}

	async execute(data: IEditProductDTO): Promise<Product> {
		let product = await this.productRepository.findById(data.id);

		if (!product) {
			throw Error('Not found');
		}

		const editedProduct = await this.productFactory.makeFromEditProductDTO(data, product);

		const errors = await validate(editedProduct);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		await this.productRepository.save(editedProduct);

		product = await this.productRepository.findById(data.id);

		return product;
	}
}
