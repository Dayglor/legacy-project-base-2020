import { autoInjectable } from 'tsyringe';
import FormData from 'form-data';
import fs from 'fs';
import { format } from 'date-fns';

import {
	IZspayECDTO,
	TipoEstabelecimento,
} from '@infrastructure/external-providers/paymentGateway/implementations/zspay/IZspayECDTO';
import { Utils } from '@infrastructure/utils';
import { Document } from '@infrastructure/database/entities/Document';

@autoInjectable()
export class ZspayPaymentGatewayFactory {
	async makeECFromConsultant(consultant: any): Promise<any> {	
		const {
			national_registration: nationalRegistration,
			email,
			address,
			trading_name: tradingName,
			company_name: companyName,
			contact_link: contactLink,
			birth_date: birthDate,
		} = consultant;

		const isPJ = nationalRegistration.length > 11;
		var form = new FormData();

		const tipoEstabelecimento = isPJ ? TipoEstabelecimento.PJ : TipoEstabelecimento.PF;
		const telefone = contactLink?.contact?.find((v) => [1, 2].includes(v.contact_type.reference))?.contact || '';
		const celular = contactLink?.contact?.find((v) => [1, 2].includes(v.contact_type.reference))?.contact || '';
		const dataNascimento = format(birthDate, 'yyyy-MM-dd');
		
		form.append('email', email);
		form.append('tipoEstabelecimentoId', +tipoEstabelecimento);
		form.append('endereco.logradouro', address.street);
		form.append('endereco.numero', address.number);
		form.append('endereco.cep', address.postal_code);
		form.append('endereco.cidade', address.city);
		form.append('endereco.estado', address.state);

		if (isPJ) {
			form.append('cnpj', nationalRegistration);
			form.append('razaoSocial', companyName);
			form.append('nomeFantasia', tradingName);
			form.append('telefone', telefone);
		} else {
			form.append('nome', tradingName);
			form.append('celular', celular);
			form.append('dataNascimento', dataNascimento);
			form.append('cpf', nationalRegistration);
		}

		await Utils.forEachAsync2(consultant.document_link.document, async (document: Document) => {
			switch (document.document) {
				case 'logo':
					form.append('logo', fs.createReadStream(document.url));
					break;
				case 'cnh':
					form.append('documentos[]', fs.createReadStream(document.url));
					break;
				case 'comprovanteEndereco':
					form.append('documentosResidencia[]', fs.createReadStream(document.url));
					break;
				case 'contratoSocial':
					form.append('documentosAtividade[]', fs.createReadStream(document.url));
					break;
				default:
					break;
			}
		});

		// const ec: IZspayECDTO = {
		// 	tipoEstabelecimentoId: isPJ ? TipoEstabelecimento.PJ : TipoEstabelecimento.PF,
		// 	email,
		// 	endereco: {
		// 		logradouro: address.street,
		// 		numero: address.number,
		// 		cep: address.postal_code,
		// 		cidade: address.city,
		// 		estado: address.state,
		// 	},
		// };

		// if (isPJ) {
		// 	ec.cnpj = nationalRegistration;
		// 	ec.razaoSocial = companyName;
		// 	ec.nomeFantasia = tradingName;
		// 	ec.telefone = contactLink?.contact?.find((v) => [1, 2].includes(v.contact_type.reference))?.contact || '';
		// } else {
		// 	ec.nome = tradingName;
		// 	ec.celular = contactLink?.contact?.find((v) => [1, 2].includes(v.contact_type.reference))?.contact || '';
		// 	ec.dataNascimento = birthDate;
		// 	ec.cpf = nationalRegistration;
		// }

		return form;
	}
}
