import { container } from 'tsyringe';

import { IProductRepository } from '@infrastructure/repositories/IProductRepository';

import { EditProductUseCase } from './EditProductUseCase';

import '@tests/beforeAll';

describe('EditProduct Tests', () => {
	it('should edit a product', async () => {
		const useCase = container.resolve(EditProductUseCase);

		const productRepository: IProductRepository = container.resolve('IProductRepository');

		let product = await productRepository.findById('894a10c2b20349a6bbcb0ca4baabef6a');

		expect(product.name).toEqual('Colchao Kingstar');

		product = await useCase.execute({
			id: '894a10c2b20349a6bbcb0ca4baabef6a',
			name: 'Colchao Portobello',
			productCode: 'ck01020304',
			categoryId: '774a10c2b20349a6bbcb0ca4baabef6a',
			userId: 'idUserConsultorMaster1',
			sku: '1020304',
			costPrice: '10',
			salePrice: '20',
			stock: 'S',
			stockQuantity: 5,
			tributes: '1',
		});

		expect(product.name).toEqual('Colchao Portobello');
	}, 10000);
});
