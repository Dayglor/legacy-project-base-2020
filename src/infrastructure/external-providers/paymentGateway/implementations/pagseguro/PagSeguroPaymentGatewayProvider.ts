import axios from 'axios';
import { URLSearchParams } from 'url';
import xml2js from 'xml2js';

import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';
import { Sale } from '@infrastructure/database/entities/Sale';

interface ICreditCardSaleDTO {
	cardOwner: string;
	cardNationalRegistration: string;
	cardPhone: string;
	cardBirthDate: string;
	amount: number;
	installments: number;
	installmentAmount: number;
	senderHash: string;
	creditCardToken: string;
	sale: Sale;
	noInterestInstallmentQuantity: string;
}

export class PagSeguroPaymentGatewayProvider {
	private url = 'https://ws.pagseguro.uol.com.br/v2/';
	private urlV1 = 'https://ws.pagseguro.uol.com.br/digital-payments/v1/';
	private email = null; // 'ativa10acao@gmail.com';
	private token = null; // 'D6D10E601C314059B62F8F210A8A1881';

	constructor() {
		if (process.env.NODE_ENV !== 'production') {
			this.url = 'https://ws.sandbox.pagseguro.uol.com.br/v2/';
		}
	}

	static transactionStatus = (status: number): string => {
		switch (status) {
			case 1:
				return 'Aguardando Pagamento';
			case 4:
				return 'Cancelada';
			case 5:
				return 'Paga';
			case 7:
				return 'Em análise';
			default:
				return null;
		}
	};

	private async makeRequest(url: string, type: string, data?: any, headers?: any, version?: string): Promise<any> {
		let request: any;
		const requestHeaders = headers || {};

		const baseUrl = !version ? this.url : this.urlV1;

		switch (type) {
			case 'post':
				try {
					request = await axios.post(`${baseUrl}${url}`, data, {
						headers: {
							Authorization: `Bearer ${this.token}`,
							...requestHeaders,
						},
					});
				} catch (error) {
					console.log(data);
					console.log(error.response);
					throw new Error('Erro ao enviar os dados para a pagseguro');
				}

				break;
			case 'put':
				request = await axios.put(`${baseUrl}${url}`, data, {
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				});
				break;
			case 'get':
				request = await axios.get(`${baseUrl}${url}`, {
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				});
				break;
			case 'delete':
				request = await axios.delete(`${baseUrl}${url}`, {
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

	async getSession(): Promise<string> {
		if (!this.email || !this.token) {
			throw new Error('Usuário sem configuração para Link de Pagamento.');
		}

		const uri = `sessions?email=${this.email}&token=${this.token}`;

		const result = await this.makeRequest(uri, 'post');

		const data = await xml2js.parseStringPromise(result.data, { explicitArray: false });

		return data?.session?.id || '';
	}

	async getTransaction(transactionCode: string): Promise<string> {
		const uri = `transactions/${transactionCode}?email=${this.email}&token=${this.token}`;

		const result = await this.makeRequest(uri, 'get');

		const data = await xml2js.parseStringPromise(result.data, { explicitArray: false });

		return data;
	}

	async getTransactionByNotificationCode(notificationCode: string, accountConfiguration: AccountConfiguration) {
		// console.log(accountConfiguration);
		const uri = `transactions/notifications/${notificationCode}?email=${accountConfiguration.private_key}&token=${accountConfiguration.token}`;

		const result = await this.makeRequest(uri, 'get');

		const data = await xml2js.parseStringPromise(result.data, { explicitArray: false });

		return data;
	}

	async getTransactionStatus(transactionCode: string, accountConfiguration: AccountConfiguration): Promise<any> {
		const uri = `transactions/${transactionCode}/status`;
		this.token = accountConfiguration.token;

		const result = await this.makeRequest(uri, 'get', null, null, 'v1');

		const data = await xml2js.parseStringPromise(result.data, { explicitArray: false });

		return data;
	}

	async initialize(email: string, token: string): Promise<void> {
		this.email = email;
		this.token = token;
	}

	async createCreditCardSale(data: ICreditCardSaleDTO): Promise<any> {
		if (!this.email || !this.token) {
			throw new Error('Usuário sem configuração para Link de Pagamento.');
		}

		const uri = `transactions?email=${this.email}&token=${this.token}`;

		const {
			cardOwner,
			cardNationalRegistration,
			cardPhone,
			cardBirthDate,
			amount,
			installments,
			installmentAmount,
			senderHash,
			creditCardToken,
			sale,
			noInterestInstallmentQuantity,
		} = data;

		const clientContact = sale?.client?.contact_link?.contact.find((a: any) => a.contact)?.contact || '';

		const params = new URLSearchParams();

		// sale.saleProduct.forEach((p: SaleProduct, i: any) => {
		// 	params.append(`itemId${i + 1}`, p.product.id);
		// 	params.append(`itemDescription${i + 1}`, p.product.name);
		// 	params.append(`itemAmount${i + 1}`, p.product.sale_price);
		// 	params.append(`itemQuantity${i + 1}`, `${p.quantity}`);
		// });

		params.append(`itemId1`, '1');
		params.append(`itemDescription1`, 'Link de Pagamento');
		params.append(`itemAmount1`, `${(amount / 100).toFixed(2)}`);
		params.append(`itemQuantity1`, '1');

		params.append('paymentMode', 'default');
		params.append('paymentMethod', 'creditCard');
		params.append('currency', 'BRL');
		params.append('creditCardHolderName', cardOwner);
		params.append('creditCardHolderCPF', cardNationalRegistration);
		params.append('creditCardHolderBirthDate', cardBirthDate);
		params.append('creditCardHolderAreaCode', `${cardPhone}`.substr(0, 2));
		params.append('creditCardHolderPhone', `${cardPhone}`.substr(2));
		params.append('installmentQuantity', `${installments}`);
		params.append('installmentValue', `${installmentAmount.toFixed(2)}`);
		params.append('senderHash', senderHash);
		params.append('creditCardToken', creditCardToken);
		params.append('noInterestInstallmentQuantity', noInterestInstallmentQuantity);

		params.append('senderName', sale?.client?.trading_name);
		params.append('senderCPF', sale?.client?.national_registration);
		params.append('senderAreaCode', `${clientContact}`.substr(0, 2));
		params.append('senderPhone', `${clientContact}`.substr(2));
		params.append('senderEmail', sale?.client?.email);

		params.append('shippingAddressRequired', 'true');
		params.append('shippingAddressStreet', sale?.delivery?.address?.street);
		params.append('shippingAddressNumber', `${sale?.delivery?.address?.number}`);
		params.append('shippingAddressComplement', sale?.delivery?.address?.complement);
		params.append('shippingAddressDistrict', sale?.delivery?.address?.neighborhood);
		params.append('shippingAddressPostalCode', sale?.delivery?.address?.postal_code);
		params.append('shippingAddressCity', sale?.delivery?.address?.city);
		params.append('shippingAddressState', sale?.delivery?.address?.state);
		params.append('shippingAddressCountry', 'BRA');

		params.append('billingAddressStreet', sale?.client?.address?.street);
		params.append('billingAddressNumber', `${sale?.client?.address?.number}`);
		params.append('billingAddressComplement', sale?.client?.address?.complement);
		params.append('billingAddressDistrict', sale?.client?.address?.neighborhood);
		params.append('billingAddressPostalCode', sale?.client?.address?.postal_code);
		params.append('billingAddressCity', sale?.client?.address?.city);
		params.append('billingAddressState', sale?.client?.address?.state);
		params.append('billingAddressCountry', 'BRA');

		const result = await this.makeRequest(uri, 'post', params, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
		});

		if (!result.data) {
			return null;
		}

		const resultData = await xml2js.parseStringPromise(result.data, { explicitArray: false });

		return resultData;
	}
}
