import { container } from 'tsyringe';

import { IClientRepository } from '@infrastructure/repositories/IClientRepository';

import { EditClientUseCase } from './EditClientUseCase';

import '@tests/beforeAll';

describe('EditClient Tests', () => {
	it('should edit a client', async () => {
		const useCase = container.resolve(EditClientUseCase);

		const clientRepository: IClientRepository = container.resolve('IClientRepository');

		let client = await clientRepository.findById('111111b9793445aad87ead5e093ff5c');

		expect(client.trading_name).toEqual('Renan');
		expect(client.address.street).toEqual('leoneta');
		expect(client.contact_link.contact[0].name).toEqual('contato1');

		client = await useCase.execute({
			id: '111111b9793445aad87ead5e093ff5c',
			tradingName: 'Rodrigo',
			email: 'renan@test.com',
			nationalRegistration: '12345678900',
			birthDate: '29/05/1999',
			gender: 'M',
			note: 'Observação',
			address: {
				street: 'Rua Salvador Simoes',
				number: 802,
				complement: 'Sala 1203',
				city: 'São Paulo',
				state: 'SP',
				neighborhood: 'Ipiranga',
				postalCode: '02839190',
				country: 'Brasil',
			},
			contacts: [
				{
					id: '111111f752cc3943c99ad44846632beabb',
					contactTypeId: '22mom75b9793445aad87ead5e093ff5d',
					name: 'contato 2',
					contact: '11987654321',
				},
			],
		});

		expect(client.trading_name).toEqual('Rodrigo');
		expect(client.address.street).toEqual('Rua Salvador Simoes');
		expect(client.contact_link.contact[0].name).toEqual('contato 2');
	}, 10000);
});
