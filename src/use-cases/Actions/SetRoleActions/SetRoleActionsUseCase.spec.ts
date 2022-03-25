import { container } from 'tsyringe';
import { Connection } from 'typeorm';

import { Role } from '@infrastructure/database/entities/Role';

import { SetRoleActionsUseCase } from './SetRoleActionsUseCase';

describe('Set Role Actions Tests', () => {
	it('should test', async () => {
		const useCase = container.resolve(SetRoleActionsUseCase);
		const mysqlClient: Connection = container.resolve('MysqlClient');
		const roleRepository = mysqlClient.getRepository(Role);

		await useCase.execute({
			roleId: '37dad75b9793445aad87ead5e093ff5c',
			actions: ['1234675b9793445aad87ead5e093ff5c'],
		});

		const role = await roleRepository.find({
			where: { id: '37dad75b9793445aad87ead5e093ff5c' },
			relations: ['actions'],
		});

		expect(role[0].name).toEqual('Consultor Master');
		const roleActions = role[0].actions.map((a) => a.id);

		expect(roleActions).toContain('1234675b9793445aad87ead5e093ff5c');
	});
});
