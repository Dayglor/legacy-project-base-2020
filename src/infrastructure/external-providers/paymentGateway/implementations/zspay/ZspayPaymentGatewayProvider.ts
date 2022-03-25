import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { autoInjectable } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { ZspayPaymentGatewayFactory } from '@infrastructure/factories/ZspayPaymentGatewayFactory';

import {
	ICreatePlan,
	IEditPlan,
	IPaymentGateway,
	ICreditSale,
	ISignPlan,
	IActivateSignature,
	ISuspendSignature,
	IDeleteSignature,
	IGetPlanDetails,
	ITicketSale,
} from '../../IPaymentGateway';

@autoInjectable()
export class ZspayPaymentGatewayProvider implements IPaymentGateway {
	private readonly url = 'http://api.zsystems.com.br/';
	private readonly token =
		process.env.NODE_ENV !== 'production'
			? 'f3bd8a2cabbeee52713c35f4bcc00775035a9635'
			: 'e27cd5662b982bdb943370ee5af7798ce7e48320';

	constructor(private readonly zspayPaymentGatewayFactory: ZspayPaymentGatewayFactory) {}

	private async makeRequest(url: string, type: string, data: any): Promise<any> {
		let request: any;

		let headers = {};

		let { token } = this;

		if (data.atEstablishment) {
			try {
				const getToken = await axios.get(`${this.url}/estabelecimentos/${data.atEstablishment}/token`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				token = getToken.data.token;
			} catch (error) {
				throw new Error('Erro ao recuperar o token do estabelecimento');
			}
		}

		switch (type) {
			case 'post':
				if (url === 'estabelecimentos') {
					headers = {
						Authorization: `Bearer ${token}`,
						...data.getHeaders(),
					};
				} else {
					headers = {
						Authorization: `Bearer ${token}`,
					};
				}
				request = await axios.post(`${this.url}${url}`, data, {
					headers,
					// headers: {
					// 	Authorization: `Bearer ${token}`,
					// 	// ...data.getHeaders(),
					// },
				});
				break;
			case 'put':
				request = await axios.put(`${this.url}${url}`, data, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				break;
			case 'get':
				request = await axios.get(`${this.url}${url}${data}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				break;
			case 'delete':
				console.log(`${this.url}${url}?${data}`);
				request = await axios.delete(`${this.url}${url}${data}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				break;

			default:
				break;
		}

		return request;
	}

	async creditSale(data: ICreditSale): Promise<any> {
		try {
			const dataSale = {
				cartao: {
					codigoSeguranca: data.card.cvv,
					numero: data.card.number,
					titular: data.card.owner,
					validade: `${data.card.expirationMonth}/${data.card.expirationYear}`,
				},
				cliente: {
					nome: data.user.trading_name,
					cpf: data.user.national_registration,
					dataNascimento: format(data.user.birth_date, 'yyyy-MM-dd'),
					email: data.user.email,
					celular: data.user.contact_link.contact.find((v) => v.contact_type.id === '654321').contact,
				},
				endereco: {
					cep: data.user.address.postal_code,
					cidade: data.user.address.city,
					estado: data.user.address.state,
					logradouro: data.user.address.street,
					complemento: data.user.address.complement,
					numero: data.user.address.number,
				},
				parcelas: data.installments || 1,
				valor: +data.amount / 100,
				tipoPagamentoId: 3,
			};

			const result = await this.makeRequest('vendas', 'post', dataSale);

			if (result.data.success === false && result.data.message) {
				throw new Error(result.data.message);
			} else if (result.data.success === false) {
				throw Error('Ocorreu um erro na hora de realizar o pagamento.');
			}

			return result.data.pedido;
		} catch (error) {
			console.log(error.data);
			throw new Error(error.message);
		}
	}

	async editPlan(data: IEditPlan): Promise<any> {
		// console.log(data);
		try {
			const dataZSPay = {
				name: data.name,
				description: data.description,
				email: data.email,
				setup_amount: data.setupAmount,
				amount: data.amount,
				grace_period: data.gracePeriod,
				tolerance_period: data.tolerancePeriod,
				frequency: data.frequency,
				interval: data.interval,
				logo: data.logo,
				currency: data.currency,
				payment_methods: data.paymentMethods,
				plan_expiration_date: data.planExpirationDate,
				has_expiration: data.hasExpiration,
				expire_subscriptions: data.expireSubscriptions,
				subscription_duration: data.subscriptionDuration,
			};

			const request = await this.makeRequest(`planos/${data.id}`, 'put', dataZSPay);
			// console.log(request);
			console.log(`Plan changed: ${request.data.plano.id}`);
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async ticketSale(data: ITicketSale): Promise<any> {
		try {
			const dataSale = {
				cliente: {
					nome: data.user.trading_name,
					cpf: data.user.national_registration,
					dataNascimento: format(parseISO(`${data.user.birth_date}`), 'yyyy-MM-dd'),
					email: data.user.email,
					celular: data.user.contact_link?.contact?.find((v) => [1, 2].includes(v.contact_type.reference))?.contact,
				},
				endereco: {
					cep: data.user.address.postal_code,
					cidade: data.user.address.city,
					estado: data.user.address.state,
					logradouro: data.user.address.street,
					complemento: data.user.address.complement,
					numero: data.user.address.number,
				},
				valor: data.amount / 100,
				dataVencimento: format(data.dueDate, 'yyyy-MM-dd'),
				descricao: '',
				tipoPagamentoId: 1,
			};

			const result = await this.makeRequest('vendas', 'post', dataSale);

			if (result.data.success === false && result.data.message) {
				console.log(result);
				throw new Error(result.data.message);
			} else if (result.data.success === false) {
				throw Error('Ocorreu um erro na hora de realizar o pagamento.');
			}

			return result.data.pedido;
		} catch (error) {
			console.log(error);
			throw new Error(error.message);
		}
	}

	async editSignatureDetails(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async createPlan(data: ICreatePlan, atEstablishment?: number): Promise<number> {
		try {
			const dataZSPay = {
				name: data.title,
				description: data.description,
				email: false,
				setup_amount: data.setupAmount || 0,
				amount: data.amount,
				grace_period: data.gracePeriod || 0,
				tolerance_period: 0,
				frequency: data.frequency,
				interval: data.interval,
				logo: true,
				currency: 'BRL',
				payment_methods: 'cartao',
				plan_expiration_date: false,
				has_expiration: true,
				expire_subscriptions: false,
				subscription_duration: +data.subscriptionDuration > 0 ? +data.subscriptionDuration - 1 : false,
				atEstablishment,
			};

			const request = await this.makeRequest('planos', 'post', dataZSPay);
			if (!request.data.success) {
				throw new Error('Erro ao gerar o plano no gateway.');
			}

			return request.data.plano;
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async getPlanDetails(data: IGetPlanDetails): Promise<any> {
		try {
			const request = await this.makeRequest('planos/', 'get', data.id);

			// console.log(request);

			return request.data.plano;
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async signPlan(data: ISignPlan): Promise<string> {
		let birthDate;

		if (typeof data.user.birth_date === 'string') {
			birthDate = format(parseISO(`${data.user.birth_date}`), 'yyyy-MM-dd');
		} else {
			birthDate = format(data.user.birth_date, 'yyyy-MM-dd');
		}

		const newSignature = {
			planoId: `${data.planId}`,
			cliente: {
				nome: data.user.trading_name,
				email: data.user.email,
				dataNascimento: birthDate,
				telefone: data.user.contact_link.contact.find((v) => v.contact_type.reference === 2)?.contact || '',
				celular:
					data.user.contact_link.contact.find((v) => v.contact_type.reference === 1)?.contact ||
					data.user.contact_link.contact.find((v) => v.contact_type.reference === 2)?.contact,
				cpf: data.user.national_registration.length === 11 ? data.user.national_registration : '',
				cnpj: data.user.national_registration.length > 11 ? data.user.national_registration : '',
			},
			endereco: {
				logradouro: data.user.address.street,
				numero: data.user.address.number,
				cep: data.user.address.postal_code,
				cidade: data.user.address.city,
				estado: data.user.address.state,
				complemento: data.user.address.complement,
			},
			cartao: {
				titular: data.card.owner,
				numero: data.card.number.replace(/\D/g, ''),
				codigoSeguranca: data.card.cvv,
				validade: `${data.card.expirationMonth}/${data.card.expirationYear.slice(-2)}`,
			},
			expiration_date: false,
		};

		if (data.user.national_registration.length === 11) {
			newSignature.cliente.cpf = data.user.national_registration.replace(/\D/g, '');
		} else {
			newSignature.cliente.cnpj = data.user.national_registration.replace(/\D/g, '');
		}

		const signature = await this.makeRequest('planos/assinar', 'post', newSignature);
		if (!signature.data.success) {
			console.log(signature.data);
			if (signature.data?.message) {
				throw new Error(signature.data.message);
			}
			throw Error('Erro ao realizar a adesão do sistema');
		}

		return signature.data.data.id;
	}

	async getSignatureDetails(id: string): Promise<void> {
		try {
			const request = await this.makeRequest('planos/assinatura/', 'get', id);

			return request.data.data;
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async activateSignature(data: IActivateSignature): Promise<void> {
		try {
			const signatureId = {
				assinatura_id: data.id,
			};

			const request = await this.makeRequest('planos/assinatura/reativar', 'post', signatureId);

			console.log(request.data);
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async suspendSignature(data: ISuspendSignature): Promise<void> {
		try {
			const signatureId = {
				assinatura_id: data.id,
			};

			const request = await this.makeRequest('planos/assinatura/suspender', 'post', signatureId);

			console.log(request.data);
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async deleteSignature(data: IDeleteSignature): Promise<void> {
		try {
			const request = await this.makeRequest('planos/assinatura/', 'delete', data.id);

			console.log(request.data);
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async registerEC(consultant: User): Promise<any> {
		try {
			const ec = await this.zspayPaymentGatewayFactory.makeECFromConsultant(consultant);
			const newEc = await this.makeRequest('estabelecimentos', 'post', ec);

			if (!newEc.data?.success) {
				throw new Error(newEc.data.error);
			}

			return newEc.data?.estabelecimento;
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}

	async getEc(id: string): Promise<any> {
		try {
			const ec = await this.makeRequest('estabelecimentos/', 'get', id);
			return ec.data.estabelecimento;
		} catch (error) {
			console.log(error);
			throw Error(error.message);
		}
	}
}
