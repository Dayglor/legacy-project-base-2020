import { container } from 'tsyringe';

import { SetCompanyUseCase } from './SetCompanyUseCase';

describe('Set company', () => {
	it('should add new company and return', async () => {
		const containerUseCase = container.resolve(SetCompanyUseCase);
		const company = await containerUseCase.execute({ name: 'Enel' });

		expect(company.name).toBe('Enel');
		expect(company.id).not.toBeNull();
	});
});
