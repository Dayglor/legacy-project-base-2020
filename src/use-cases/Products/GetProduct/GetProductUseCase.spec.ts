import { container } from 'tsyringe';

import { GetProductUseCase } from './GetProductUseCase';
import '@tests/beforeAll';

describe('GetProduct Tests', () => {
	it('should return Product by ID', async () => {
		const useCase = container.resolve(GetProductUseCase);

		const product = await useCase.execute({ id: '894a10c2b20349a6bbcb0ca4baabef6a' });

		expect(product.name).toEqual('Colchao Kingstar');
	});
});
