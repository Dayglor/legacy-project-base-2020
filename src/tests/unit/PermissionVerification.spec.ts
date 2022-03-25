import { container } from 'tsyringe';

import { Permission } from '@infrastructure/database/entities/Permission';
import { User } from '@infrastructure/database/entities/User';
import { PermissionVerification } from '@infrastructure/http/PermissionVerification';
import { MysqlPermissionRepository } from '@infrastructure/repositories/implementations/MysqlPermissionRepository';
import { MysqlUserRepository } from '@infrastructure/repositories/implementations/MysqlUserRepository';
import { IPermissionRepository } from '@infrastructure/repositories/IPermissionRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

describe('Permission Verification Tests', () => {
	let userRepository: IUserRepository;
	let permissionRepository: IPermissionRepository;
	let permissionVerification: PermissionVerification;

	let user: User;

	beforeAll(async () => {
		userRepository = container.resolve(MysqlUserRepository);
		permissionRepository = container.resolve(MysqlPermissionRepository);
		permissionVerification = container.resolve(PermissionVerification);
		user = await userRepository.findByEmail('basic@zsystems.com.br');

		const newPermission = new Permission();
		newPermission.user = user;
		newPermission.entityId = '37dad75b912345aad87ead5e093ff5c';
		newPermission.entityType = 'holder';

		await permissionRepository.save(newPermission);
	});

	it('should verify a permission with an user', async () => {
		const permission = await permissionVerification.verify({
			userId: user.id,
			entityId: '37dad75b912345aad87ead5e093ff5c',
			entityType: 'holder',
		});

		expect(permission).toBeTruthy();
	});

	it('should verify and fail a permission with an user', async () => {
		const permission = await permissionVerification.verify({
			userId: user.id,
			entityId: '37dad75b912345aad87ead5e093ff5c',
			entityType: 'marketplace',
		});

		expect(permission).toBeFalsy();
	});
});
