import { container } from 'tsyringe';

import { GetClientUseCase } from './GetClientUseCase';
import '@tests/beforeAll';

describe('GetClient Tests', () => {
	it('should return Client by ID', async () => {
		const useCase = container.resolve(GetClientUseCase);

		const client = await useCase.execute({ id: '009d10c2b20349a6bbcb0ca4baabef6a' });

		expect(client.name).toEqual('Danilo');
	});
});
