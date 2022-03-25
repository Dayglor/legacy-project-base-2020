import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Product } from '@infrastructure/database/entities/Product';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { ProductFactory } from '@infrastructure/factories/ProductFactory';
import { IProductRepository } from '@infrastructure/repositories/IProductRepository';

import { IRegisterProductDTO } from './RegisterProductDTO';

@autoInjectable()
export class RegisterProductUseCase {
	constructor(
		@inject('IProductRepository') private readonly productRepository: IProductRepository,
		private readonly productFactory: ProductFactory
	) {}

	async execute(data: IRegisterProductDTO): Promise<Product> {
		const newProduct = await this.productFactory.makeFromRegisterProductDTO(data);

		const errors = await validate(newProduct);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		const product = await this.productRepository.save(newProduct);

		return product;
	}
}
