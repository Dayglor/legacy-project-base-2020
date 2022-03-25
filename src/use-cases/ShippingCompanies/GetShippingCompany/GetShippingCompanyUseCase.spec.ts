import { container } from 'tsyringe';

import { GetShippingCompanyUseCase } from './GetShippingCompanyUseCase';
import '@tests/beforeAll';

describe('GetShippingCompany Tests', () => {
	it('should return Shipping Company by ID', async () => {
		const useCase = container.resolve(GetShippingCompanyUseCase);

		const shippingCompany = await useCase.execute({ id: '645f10c2b20349a6bbcb0ca4baabef6a' });

		expect(shippingCompany.trading_name).toEqual('CastLog');
	});
});
