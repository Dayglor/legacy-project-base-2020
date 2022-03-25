// import { container } from 'tsyringe';

// import { GetConsultantsUseCase } from './GetConsultantsUseCase';
// import '@tests/beforeAll';

// describe('GetConsultants Tests', () => {
// 	it('should return all consultants', async () => {
// 		const useCase = container.resolve(GetConsultantsUseCase);

// 		const consultants = await useCase.execute({ parentId: '7436f767gf6876s8fdfds' });

// 		expect(consultants.length).toBeGreaterThanOrEqual(2);
// 	});

// 	it('should return 1 consultant', async () => {
// 		const useCase = container.resolve(GetConsultantsUseCase);

// 		const consultants = await useCase.execute({
// 			parentId: '7436f767gf6876s8fdfds',
// 			limit: 1,
// 			page: 2,
// 		});

// 		expect(consultants.length).toEqual(1);
// 	});
// });
