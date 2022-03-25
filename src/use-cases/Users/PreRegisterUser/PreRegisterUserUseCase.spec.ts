import { container } from 'tsyringe';

import '@tests/beforeAll';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IMajorityMemberRepository } from '@infrastructure/repositories/IMajorityMemberRepository';

import { PreRegisterUserUseCase } from './PreRegisterUserUseCase';

describe('Pre Register User', () => {
	it('should pre register an user', async () => {
		const useCase = container.resolve(PreRegisterUserUseCase);

		const contactRepository: IContactRepository = container.resolve('IContactRepository');

		const user = await useCase.execute({
			email: 'test@test.com',
			password: 'test',
			nationalRegistration: '12345678910',
			tradingName: 'Test Trading Name',
			companyName: 'Test Company Name',
			gender: 'M',
			birthDate: '1989-12-06',
			revenues: 100000,
			commision: 10,
			address: {
				street: 'Rua Genaro Arilla Arensanz',
				city: 'São Paulo',
				complement: '',
				country: 'BR',
				neighborhood: 'Vila Ivone',
				number: 10,
				postalCode: '03275090',
				state: 'SP',
			},
			contacts: [{ contactTypeId: '22mom75b9793445aad87ead5e093ff5c', name: 'Rodrigo', contact: '11987654321' }],
			documents: [],
		});

		expect(user.role.name).toEqual('Consultor');
		expect(user.address.street).toEqual('Rua Genaro Arilla Arensanz');
		expect(user.contact_link).not.toBeNull();

		const contacts = await contactRepository.findByContactLinkId(user.contact_link.id);

		expect(contacts.length).toEqual(1);
		expect(contacts[0].contact_link.id).toEqual(user.contact_link.id);
	}, 10000);

	it('should pre register an user with majority member', async () => {
		const useCase = container.resolve(PreRegisterUserUseCase);

		const majorityMemberRepository: IMajorityMemberRepository = container.resolve('IMajorityMemberRepository');

		const user = await useCase.execute({
			email: 'test2@test.com',
			password: 'test',
			nationalRegistration: '12345678911',
			tradingName: 'Test Trading Name',
			companyName: 'Test Company Name',
			gender: 'M',
			birthDate: '1989-12-06',
			revenues: 100000,
			commision: 10,
			address: {
				street: 'Rua Genaro Arilla Arensanz',
				city: 'São Paulo',
				complement: '',
				country: 'BR',
				neighborhood: 'Vila Ivone',
				number: 10,
				postalCode: '03275090',
				state: 'SP',
			},
			majorityMember: {
				tradingName: 'Majority Member',
				companyName: 'Company Name',
				email: 'mm@test.com',
				birthDate: '2021-07-14',
				nationalRegistration: '34567184890',
				contacts: [],
				documents: [],
				address: {
					street: 'Rua Genaro Arilla Arensanz',
					city: 'São Paulo',
					complement: '',
					country: 'BR',
					neighborhood: 'Vila Ivone',
					number: 10,
					postalCode: '03275090',
					state: 'SP',
				},
			},
			contacts: [],
			documents: [],
		});

		const mm = await majorityMemberRepository.findByUserId(user.id);

		expect(mm.email).toEqual('mm@test.com');
		expect(mm.national_registration).toEqual('34567184890');
	}, 10000);
});
