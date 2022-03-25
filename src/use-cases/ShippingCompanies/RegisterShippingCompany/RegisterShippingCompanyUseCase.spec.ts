import { container } from 'tsyringe';

import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IDocumentRepository } from '@infrastructure/repositories/IDocumentRepository';

import '@tests/beforeAll';

import { RegisterShippingCompanyUseCase } from './RegisterShippingCompanyUseCase';

it('should register a shipping company', async () => {
	const useCase = container.resolve(RegisterShippingCompanyUseCase);

	const contactRepository: IContactRepository = container.resolve('IContactRepository');
	const documentRepository: IDocumentRepository = container.resolve('IDocumentRepository');

	const shippingCompany = await useCase.execute({
		tradingName: 'Castlog',
		companyName: 'CastLog Ltda',
		note: 'observação',
		address: {
			street: 'Rua Salvador Simoes',
			number: 801,
			complement: 'Sala 1203',
			city: 'São Paulo',
			state: 'SP',
			neighborhood: 'Ipiranga',
			postalCode: '02839190',
			country: 'Brasil',
		},
		contacts: [
			{
				contactTypeId: '11mom75b9793445aad87ead5e093ff5d',
				name: 'Transportadora',
				contact: '1134567890',
			},
			{
				contactTypeId: '22mom75b9793445aad87ead5e093ff5c',
				name: 'Transportadora',
				contact: '11987654321',
			},
		],
		documents: [
			{
				documentTypeId: '55mom75b9793445aad87ead5e093ff5d',
				document: '35856667875',
				fileName: '',
				mimetype: '',
				size: '',
				url: '',
			},
			{
				documentTypeId: '66mom75b9793445aad87ead5e093ff5c',
				document: '23.109.376/0001-34',
				fileName: '',
				mimetype: '',
				size: '',
				url: '',
			},
		],
	});

	expect(shippingCompany.trading_name).toEqual('Castlog');
	expect(shippingCompany.address.street).toEqual('Rua Salvador Simoes');
	expect(shippingCompany.contact_link).not.toBeNull();

	const contacts = await contactRepository.findByContactLinkId(shippingCompany.contact_link.id);

	expect(contacts.length).toBeGreaterThanOrEqual(1);
	expect(contacts[0].contact_link.id).toEqual(shippingCompany.contact_link.id);

	const documents = await documentRepository.findByDocumentLinkId(shippingCompany.document_link.id);

	expect(documents.length).toBeGreaterThanOrEqual(1);
	expect(documents[0].document_link.id).toEqual(shippingCompany.document_link.id);
}, 10000);
