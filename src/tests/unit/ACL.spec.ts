import { container } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { ACL } from '@infrastructure/http/ACL';
import { MysqlUserRepository } from '@infrastructure/repositories/implementations/MysqlUserRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { getMockReq, getMockRes } from '@jest-mock/express';

describe('ACL tests', () => {
	let acl: ACL;
	let userRepository: IUserRepository;

	const req = getMockReq();
	const { res, next, clearMockRes } = getMockRes();

	let userAdmin: User;
	let userBasic: User;

	beforeEach(async () => {
		clearMockRes();

		acl = container.resolve(ACL);
		userRepository = container.resolve(MysqlUserRepository);

		userAdmin = await userRepository.findByEmail('test@zsystems.com.br', { role: true });
		userBasic = await userRepository.findByEmail('basic@zsystems.com.br', { role: true });

		expect(userAdmin.trading_name).toEqual('Admin');
		expect(userBasic.trading_name).toEqual('Basic');
	});

	it('should check if an Admin user has access to getRoles', async () => {
		req.currentUser = userAdmin;
		await acl.canAccessAction('getRoles')(req, res, next);

		expect(next).toBeCalled();
	});

	it('should check if an Basic user has access to getRoles', async () => {
		req.currentUser = userBasic;
		await acl.canAccessAction('getRoles')(req, res, next);

		expect(next).toBeCalled();

		await acl.canAccessAction('getRoles')(req, res, next);
	});

	it('should check if an Basic user has access to actionTest', async () => {
		req.currentUser = userBasic;
		await acl.canAccessAction('actionTest')(req, res, next);

		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "You can't access this endpoint.",
			})
		);
	});
});
