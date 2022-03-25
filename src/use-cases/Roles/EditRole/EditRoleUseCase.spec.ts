import { container } from 'tsyringe';

import '@tests/beforeAll';
import { EditRoleUseCase } from './EditRoleUseCase';

describe('EditRole Tests', () => {
	it('should edit a role', async () => {
		const useCase = container.resolve(EditRoleUseCase);

		const role = await useCase.execute({
			id: '37dad75b9793445aad87ead5e093ff5e',
			name: 'New Name',
		});

		expect(role.name).toEqual('New Name');
	});
});
