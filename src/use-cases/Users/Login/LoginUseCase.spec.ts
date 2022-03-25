import '@tests/beforeAll';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';

import { LoginUseCase } from './LoginUseCase';

it('should login to a user', async () => {
	const useCase = container.resolve(LoginUseCase);

	const token = await useCase.execute({
		email: 'test@zsystems.com.br',
		password: 'teste',
	});

	expect(token).toBeDefined();

	const user: any = jwt.decode(token);

	expect(user.trading_name).toEqual('Admin');
	expect(user.status).toEqual('active');
}, 10000);
