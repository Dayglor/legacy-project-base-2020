import { container } from 'tsyringe';

import { GetCategoriesUseCase } from './GetCategoriesUseCase';

describe('Get products categories', () => {
	it('should return the products categories', async () => {
		const containerUseCase = container.resolve(GetCategoriesUseCase);
		const categories = await containerUseCase.execute({});

		expect(categories.length).toBeGreaterThan(0);
	});
});
