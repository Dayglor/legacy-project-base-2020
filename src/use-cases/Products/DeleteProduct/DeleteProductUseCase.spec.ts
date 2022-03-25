import { container } from 'tsyringe';

import { IProductRepository } from '@infrastructure/repositories/IProductRepository';

import { DeleteProductUseCase } from './DeleteProductUseCase';
import '@tests/beforeAll';

describe('DeleteProduct Tests', () => {
	it('should delete product by ID', async () => {
		const useCase = container.resolve(DeleteProductUseCase);

		const productRepository: IProductRepository = container.resolve('IProductRepository');

		await useCase.execute({ id: '67d62b40be82452f91135a2c37248cb1' });

		const product = await productRepository.findById('67d62b40be82452f91135a2c37248cb1');

		expect(product).toEqual(undefined);
	});
});
