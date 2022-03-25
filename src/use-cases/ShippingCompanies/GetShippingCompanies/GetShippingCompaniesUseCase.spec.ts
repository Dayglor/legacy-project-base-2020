import { container } from 'tsyringe';

import { GetShippingCompaniesUseCase } from './GetShippingCompaniesUseCase';
import '@tests/beforeAll';

describe('GetShippingCompanies Tests', () => {
	it('should return all shipping companies', async () => {
		const useCase = container.resolve(GetShippingCompaniesUseCase);

		const shippingCompanies = await useCase.execute();

		expect(shippingCompanies.length).toBeGreaterThanOrEqual(2);
	});

	it('should return 1 shipping company', async () => {
		const useCase = container.resolve(GetShippingCompaniesUseCase);

		const shippingCompanies = await useCase.execute({
			limit: 1,
			page: 2,
		});

		expect(shippingCompanies.length).toEqual(1);
	});
});
