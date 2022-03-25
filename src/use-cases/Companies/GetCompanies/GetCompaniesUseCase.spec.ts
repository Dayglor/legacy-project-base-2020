import { container } from 'tsyringe';

import { GetCompaniesUseCase } from './GetCompaniesUseCase';

describe('Get companies', () => {
	it('should return the companies', async () => {
		const containerUseCase = container.resolve(GetCompaniesUseCase);
		const companies = await containerUseCase.execute({});

		expect(companies.length).toBeGreaterThan(0);
	});
});
