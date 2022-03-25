import { autoInjectable, inject } from 'tsyringe';

import { Webhooks } from '@infrastructure/database/entities/Webhooks';
import { PagSeguroPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/pagseguro/PagSeguroPaymentGatewayProvider';
import { WebhookFactory } from '@infrastructure/factories/WebhookFactory';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IPaymentRepository } from '@infrastructure/repositories/IPaymentRepository';
import { IWebhookRepository } from '@infrastructure/repositories/IWebhookRepository';

import { IPagseguroParmsWebhook, IPagseguroWebhook } from './PostPagseguroWebhook';

@autoInjectable()
export class PostWebhookUseCase {
	constructor(
		@inject('IWebhookRepository') private readonly webhookRepository: IWebhookRepository,
		@inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
		@inject('IAccountConfigurationRepository') private readonly accountConfiguration: IAccountConfigurationRepository,
		private readonly webhookFactory: WebhookFactory,
		private readonly pagSeguroPaymentGatewayProvider: PagSeguroPaymentGatewayProvider
	) {}

	async save(data?: IPagseguroWebhook, params: IPagseguroParmsWebhook): Promise<Webhooks> {
		// const { limit, page, searchByEmail, searchByName, parentId } = data || {};

		const webhook = await this.webhookFactory.makeFromPagSeguroWebhook(data, params);
		const newWebhook = await this.webhookRepository.save(webhook);

		// Executa uma ação com o webhook.

		return newWebhook;
	}

	async execute(data: IPagseguroWebhook, params: IPagseguroParmsWebhook): Promise<boolean> {
		const { notificationCode } = data;
		const { email } = params;

		const accountConfiguration = await this.accountConfiguration.find({
			privateKey: email,
		});

		if (!accountConfiguration.length) {
			console.log(`Configuração da conta não foi encontrada, notification code: ${notificationCode}`);
			return false;
		}
		try {
			const pagseguroData = await this.pagSeguroPaymentGatewayProvider.getTransactionByNotificationCode(
				notificationCode,
				accountConfiguration[0]
			);
			console.log(`pagseguroData Transaction data`);
			console.log(pagseguroData.transaction);
			switch (pagseguroData.transaction.status) {
				case '1': // aguarando pagamento
					break;
				case '2': // Em análise
					await this.analysePayment(pagseguroData.transaction.code);
					break;
				case '3': // paga
					await this.approvePayment(pagseguroData.transaction.code);
					break;
				case '4': // disponível
					break;
				case '5': // em disputa
					await this.disputPayment(pagseguroData.transaction.code);
					break;
				case '6': // devolvida
					await this.returnedPayment(pagseguroData.transaction.code);
					break;
				case '7': // Cancelado
					await this.cancelPayment(pagseguroData.transaction.code);
					break;

				default:
					console.log(
						`Mudança de status ainda não programada. Pagseguro Transaction status: ${pagseguroData.transaction.status}`
					);
					break;
			}

			// console.log(status);
		} catch (error) {
			console.log(error);
		}
		// console.log(transaction);
		return true;
	}

	async returnedPayment(transactionCode: string): Promise<void> {
		const payment = await this.paymentRepository.find({
			externalId: transactionCode,
		});

		const data = payment[0];

		if (!payment.length) {
			console.log(`Pagamento não encontrado.`);
		}

		data.status = 'returned_payment';
		await data.save();
		console.log(`Pagamento devolvido ao cliente`);
	}

	async disputPayment(transactionCode: string): Promise<void> {
		const payment = await this.paymentRepository.find({
			externalId: transactionCode,
		});

		const data = payment[0];

		if (!payment.length) {
			console.log(`Pagamento não encontrado.`);
		}

		data.status = 'dispute';
		await data.save();
		console.log(`Pagamento em disputa`);
	}

	async analysePayment(transactionCode: string): Promise<void> {
		const payment = await this.paymentRepository.find({
			externalId: transactionCode,
		});

		const data = payment[0];

		if (!payment.length) {
			console.log(`Pagamento não encontrado.`);
		}

		data.status = 'analysing';
		await data.save();
		console.log(`Pagamento sendo analisado`);
	}

	async approvePayment(transactionCode: string): Promise<void> {
		const payment = await this.paymentRepository.find({
			externalId: transactionCode,
		});

		const data = payment[0];

		if (!payment.length) {
			console.log(`Pagamento não encontrado.`);
		}

		data.status = 'approved';
		await data.save();
		console.log(`Pagamento Aprovado`);
	}

	async cancelPayment(transactionCode: string): Promise<void> {
		const payment = await this.paymentRepository.find({
			externalId: transactionCode,
		});

		const data = payment[0];

		if (!payment.length) {
			console.log(`Pagamento não encontrado.`);
		}

		data.status = 'repproved';
		await data.save();
		console.log(`Pagamento cancelado`);
	}
}
