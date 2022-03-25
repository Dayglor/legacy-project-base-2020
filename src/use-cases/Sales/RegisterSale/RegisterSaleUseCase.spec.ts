import { container } from 'tsyringe';

import '@tests/beforeAll';
import { RegisterSaleUseCase } from './RegisterSaleUseCase';

describe('RegisterSale Tests', () => {
	it('should register a new sale', async () => {
		try {
			const useCase = container.resolve(RegisterSaleUseCase);

			const sale = await useCase.execute({
				client: {
					address: {
						city: 'São Paulo',
						country: 'BR',
						neighborhood: 'Vila Ema',
						number: 10,
						postalCode: '03275090',
						state: 'SP',
						street: 'Rua Genaro Arilla Arensanz',
					},
					birthDate: '1989-12-06',
					contacts: [],
					email: 'email@sale.com',
					name: 'Nome do Cliente',
					nationalRegistration: '34567184890',
				},
				commissions: [],
				deliveryAddress: {
					city: 'São Paulo',
					country: 'BR',
					neighborhood: 'Vila Ema',
					number: 10,
					postalCode: '03275090',
					state: 'SP',
					street: 'Rua Genaro Arilla Arensanz',
				},
				payments: [{ amount: 10, paymentType: 1 }],
				products: [{ id: '894a10c2b20349a6bbcb0ca4baabef6a', quantity: 1, note: 'Observação' }],
				userId: 'idUserConsultorMaster1',
				files: [],
				notes: 'Observação da Venda',
			});

			console.log(sale);

			expect(sale.amount).toEqual(10);
		} catch (error) {
			console.log(error);
		}
	});
});
