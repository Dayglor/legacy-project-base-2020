import { autoInjectable, inject } from 'tsyringe';

import { Product } from '@infrastructure/database/entities/Product';
import { IProductRepository } from '@infrastructure/repositories/IProductRepository';

import { IGetProductDTO } from './GetProductDTO';

@autoInjectable()
export class GetProductUseCase {
	constructor(@inject('IProductRepository') private readonly productRepository: IProductRepository) {}

	async execute(data: IGetProductDTO): Promise<Product> {
		const product = await this.productRepository.findById(data.id);
		if (!product) {
			throw Error('Not found');
		}
		return product;
	}
}
