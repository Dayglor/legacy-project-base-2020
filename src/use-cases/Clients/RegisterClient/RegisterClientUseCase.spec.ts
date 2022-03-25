import { container } from 'tsyringe';

import { IContactRepository } from '@infrastructure/repositories/IContactRepository';

import '@tests/beforeAll';

import { RegisterClientUseCase } from './RegisterClientUseCase';

it('should register a client', async () => {
	const useCase = container.resolve(RegisterClientUseCase);

	const contactRepository: IContactRepository = container.resolve('IContactRepository');

	const client = await useCase.execute({
		tradingName: 'Renan',
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
				contactTypeId: '22mom75b9793445aad87ead5e093ff5c',
				name: 'Renan',
				contact: '11987654321',
			},
		],
	});

	expect(client.trading_name).toEqual('Renan');
	expect(client.address.street).toEqual('Rua Salvador Simoes');
	expect(client.contact_link).not.toBeNull();

	const contacts = await contactRepository.findByContactLinkId(client.contact_link.id);

	expect(contacts.length).toBeGreaterThanOrEqual(1);
	expect(contacts[0].contact_link.id).toEqual(client.contact_link.id);
}, 10000);
