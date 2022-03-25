// import { container } from 'tsyringe';

// import { IClientRepository } from '@infrastructure/repositories/IClientRepository';

// import { DeleteClientUseCase } from './DeleteUserUseCase';
// import '@tests/beforeAll';

// describe('DeleteClient Tests', () => {
// 	it('should delete Client by ID', async () => {
// 		const useCase = container.resolve(DeleteClientUseCase);

// 		const clientRepository: IClientRepository = container.resolve('IClientRepository');

// 		await useCase.execute({ id: '741d65d10fe64421a5da171f852b6bde' });

// 		const client = await clientRepository.findById('741d65d10fe64421a5da171f852b6bde');

// 		expect(client).toEqual(undefined);
// 	});
// });
