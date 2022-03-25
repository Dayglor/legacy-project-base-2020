// import { container } from 'tsyringe';

// import '@tests/beforeAll';

// import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

// import { EditConsultantUseCase } from './EditConsultantUseCase';

// describe('Edit Consultant', () => {
// 	it('should edit a consultant', async () => {
// 		const useCase = container.resolve(EditConsultantUseCase);

// 		const userRepository: IUserRepository = container.resolve('IUserRepository');

// 		const id = 'idUserConsultorFilho1';
// 		const parentId = '7436f767gf6876s8fdfds';

// 		let consultant = await userRepository.findChild({ id, parentId });

// 		expect(consultant.trading_name).toEqual('Consultor 1');
// 		expect(consultant.address.street).toEqual('leoneta');
// 		expect(consultant.contact_link.contact[0].name).toEqual('contato0');

// 		consultant = await useCase.execute({
// 			id: 'idUserConsultorFilho1',
// 			parentId: '7436f767gf6876s8fdfds',
// 			email: 'test@test.com',
// 			nationalRegistration: '12345678910',
// 			tradingName: 'Test Trading Name',
// 			companyName: 'Test Company Name',
// 			gender: 'M',
// 			birthDate: '1989-12-06',
// 			commision: 10,
// 			address: {
// 				street: 'Rua Genaro Arilla Arensanz',
// 				city: 'São Paulo',
// 				complement: '',
// 				country: 'BR',
// 				neighborhood: 'Vila Ivone',
// 				number: 10,
// 				postalCode: '03275090',
// 				state: 'SP',
// 			},
// 			contacts: [
// 				{
// 					id: '000000f752cc3943c99ad44846632beabb',
// 					contactTypeId: '22mom75b9793445aad87ead5e093ff5c',
// 					name: 'Rodrigo',
// 					contact: '11987654321',
// 				},
// 			],
// 		});

// 		expect(consultant.trading_name).toEqual('Test Trading Name');
// 		expect(consultant.address.street).toEqual('Rua Genaro Arilla Arensanz');
// 		expect(consultant.contact_link.contact[0].name).toEqual('Rodrigo');
// 	}, 10000);
// });
