import { container } from 'tsyringe';

import { SetCategoryUseCase } from './SetCategoryUseCase';

describe('Set product category', () => {
	it('should new product category and return', async () => {
		const containerUseCase = container.resolve(SetCategoryUseCase);
		const category = await containerUseCase.execute({ title: 'Categoria de testes' });

		expect(category.title).toBe('Categoria de testes');
		expect(category.id).not.toBeNull();
	});
});
