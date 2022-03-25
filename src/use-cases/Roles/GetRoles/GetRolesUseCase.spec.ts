import { container } from 'tsyringe';

import { GetRolesUseCase } from './GetRolesUseCase';
import '@tests/beforeAll';

describe('GetRoles Tests', () => {
	it('should return all roles', async () => {
		const useCase = container.resolve(GetRolesUseCase);

		const roles = await useCase.execute();

		expect(roles.length).toBeGreaterThanOrEqual(2);
	});

	it('should return 1 role', async () => {
		const useCase = container.resolve(GetRolesUseCase);

		const roles = await useCase.execute({
			limit: 1,
			page: 2,
		});

		expect(roles.length).toEqual(1);
	});
});
