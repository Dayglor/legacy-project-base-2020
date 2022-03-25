import { autoInjectable, inject } from 'tsyringe';

import { IProductRepository } from '@infrastructure/repositories/IProductRepository';

import { IDeleteProductDTO } from './DeleteProductDTO';

@autoInjectable()
export class DeleteProductUseCase {
	constructor(@inject('IProductRepository') private readonly productRepository: IProductRepository) {}

	async execute(data: IDeleteProductDTO): Promise<void> {
		const product = await this.productRepository.findById(data.id);
		if (!product) {
			throw Error('Not found');
		}
		await this.productRepository.delete(data.id);
	}
}
