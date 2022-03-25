import { container } from 'tsyringe';

import '@tests/beforeAll';

import { RegisterProductUseCase } from './RegisterProductUseCase';

it('should register a product', async () => {
	const useCase = container.resolve(RegisterProductUseCase);

	const product = await useCase.execute({
		name: 'Colchao King',
		productCode: 'CK12345',
		categoryId: '774a10c2b20349a6bbcb0ca4baabef6a',
		userId: '7436f767gf6876s8fdfds',
		sku: '12345',
		costPrice: '1000',
		salePrice: '1500',
		stock: 'S',
		stockQuantity: 3,
		tributes: 'ICMS SELIC',
	});

	expect(product.name).toEqual('Colchao King');
}, 10000);
