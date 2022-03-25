import { container } from 'tsyringe';

import { GetRoleUseCase } from './GetRoleUseCase';
import '@tests/beforeAll';

describe('GetRole Tests', () => {
	it('should return Administrator role', async () => {
		const useCase = container.resolve(GetRoleUseCase);

		const role = await useCase.execute('45dad75b9793445aad87ead5e093ff5c');

		expect(role.name).toEqual('Administrador');
	});
});
