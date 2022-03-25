import { container } from 'tsyringe';

import { RegisterRoleUseCase } from './RegisterRoleUseCase';
import '@tests/beforeAll';

it('should register a parent role and a child role', async () => {
	const useCase = container.resolve(RegisterRoleUseCase);

	const role = await useCase.execute({
		name: 'Role Parent',
	});

	expect(role.name).toEqual('Role Parent');

	const roleChild = await useCase.execute({
		parentId: role.id,
		name: 'Role Child',
	});

	expect(roleChild.parent.name).toEqual('Role Parent');
	expect(roleChild.name).toEqual('Role Child');
}, 10000);
