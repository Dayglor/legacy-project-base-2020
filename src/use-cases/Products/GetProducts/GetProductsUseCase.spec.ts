import { container } from 'tsyringe';

import { GetProductsUseCase } from './GetProductsUseCase';
import '@tests/beforeAll';

describe('GetProducts Tests', () => {
	it('should return all products', async () => {
		const useCase = container.resolve(GetProductsUseCase);

		const products = await useCase.execute();

		expect(products.length).toBeGreaterThanOrEqual(2);
	});

	it('should return 1 product', async () => {
		const useCase = container.resolve(GetProductsUseCase);

		const products = await useCase.execute({
			limit: 1,
			page: 2,
		});

		expect(products.length).toEqual(1);
	});
});
