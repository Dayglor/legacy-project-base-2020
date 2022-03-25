import { container } from 'tsyringe';

import { RegisterUserUseCase } from './RegisterUserUseCase';
import '@tests/beforeAll';

it('should register an user', async () => {
	try {
		const useCase = container.resolve(RegisterUserUseCase);

		const user = await useCase.execute({
			name: 'Test Register User',
			email: 'test@test.com',
			password: 'test',
			nationalRegistration: '12345678910',
			roleId: '45dad75b9793445aad87ead5e093ff5c',
		});

		expect(user.name).toEqual('Test Register User');
		expect(user.role.name).toEqual('Administrator');
	} catch (error) {
		console.log(error);
	}
}, 10000);
