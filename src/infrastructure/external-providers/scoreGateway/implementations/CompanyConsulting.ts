import axios from 'axios';

import { IScoreQueryProvider } from '../IScoreGateway';

export class CompanyConsulting implements IScoreQueryProvider {
	private url = 'https://api-automatic.scibhive.com.br';
	private token = '577761f0-91bd-484c-9361-9ca68937f6d7';

	private authorization = 'Q0xFQVIuQ0FJUk86Q2xlYXJAMjAyMQ==';

	// constructor() {
	// 	this.doLogin();
	// }

	private async doLogin() {
		const response = await axios.get(`${this.url}/Seguranca/GetToken`, {
			headers: {
				Authorization: `Basic ${this.authorization}`,
			},
		});

		this.token = response.data.token;
	}

	private async makeRequest(url: string, type: string, data: any): Promise<any> {
		let request: any;

		switch (type) {
			case 'post':
				request = await axios.post(`${this.url}${url}`, data, {
					headers: {
						Authorization: `Bearer ${this.token}`,
						...data.getHeaders(),
					},
				});
				break;
			case 'put':
				request = await axios.put(`${this.url}${url}`, data, {
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				});
				break;
			case 'get':
				request = await axios.get(`${this.url}${url}${data}`, {
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				});
				break;
			case 'delete':
				console.log(`${this.url}${url}?${data}`);
				request = await axios.delete(`${this.url}${url}${data}`, {
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				});
				break;

			default:
				break;
		}

		return request;
	}

	async consult(document: string, tipo: string): Promise<any> {
		let result;
		let riscoCredito = null;
		let socios = null;
		await this.doLogin();

		if (document.toString().length > 11) {
			result = await this.makeRequest(`/Credit/Empresa/Relatorio`, 'get', `?cnpj=${document}&tipo=${tipo}`);
			// riscoCredito = await this.makeRequest(
			// 	`/Credit/Empresa/Restritivo`,
			// 	'get',
			// 	`?cnpj=${document}&idConsulta=${result.data.idConsulta}`
			// );
			riscoCredito = await this.makeRequest(
				`/Credit/Empresa/RiscoCredito`,
				'get',
				`?cnpj=${document}&idConsulta=${result.data.idConsulta}`
			);

			socios = await this.makeRequest(
				`/Credit/Empresa/Socios`,
				'get',
				`?cnpj=${document}&idConsulta=${result.data.idConsulta}`
			);
		} else {
			result = await this.makeRequest(`/Credit/Pessoa/Relatorio`, 'get', `?cpf=${document}}&tipo=${tipo}`);
			riscoCredito = await this.makeRequest(
				`/Credit/Pessoa/RiscoCredito`,
				'get',
				`?cpf=${document}&idConsulta=${result.data.idConsulta}`
			);
		}

		const returnData = {
			requestId: result.data.idConsulta,
			score: result.data,
			riscoCredito: riscoCredito.data,
			socios,
			query: document,
		};

		return returnData;
		// throw new Error('Method not implemented.');
	}
	details(data: any): Promise<any> {
		return data;
		// throw new Error('Method not implemented.');
	}
}
