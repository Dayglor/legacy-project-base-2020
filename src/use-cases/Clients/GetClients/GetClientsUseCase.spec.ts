import { container } from 'tsyringe';

import { GetClientsUseCase } from './GetClientsUseCase';
import '@tests/beforeAll';

describe('GetClients Tests', () => {
	it('should return all clients', async () => {
		const useCase = container.resolve(GetClientsUseCase);

		const clients = await useCase.execute();

		expect(clients.length).toBeGreaterThanOrEqual(2);
	});

	it('should return 1 client', async () => {
		const useCase = container.resolve(GetClientsUseCase);

		const clients = await useCase.execute({
			limit: 1,
			page: 2,
		});

		expect(clients.length).toEqual(1);
	});
});
