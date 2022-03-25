import { container } from 'tsyringe';

import '@tests/beforeAll';
import { DeleteRoleUseCase } from './DeleteRoleUseCase';

describe('DeleteRole Tests', () => {
	it('should delete a role', async () => {
		const useCase = container.resolve(DeleteRoleUseCase);

		const role = await useCase.execute('37dad75b9793445aad87ead5e093ff5f');

		expect(role).toBeTruthy();
	});
});
