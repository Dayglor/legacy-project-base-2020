import { autoInjectable, inject } from 'tsyringe';
import { EntityManager, TransactionManager } from 'typeorm';

import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';
import { Webhooks } from '@infrastructure/database/entities/Webhooks';
import { ClientFactory } from '@infrastructure/factories/ClientFactory';
import { PaymentFactory } from '@infrastructure/factories/PaymentFactory';
import { SaleFactory } from '@infrastructure/factories/SaleFactory';
import { SaleProductFactory } from '@infrastructure/factories/SaleProductFactory';
import { WebhookFactory } from '@infrastructure/factories/WebhookFactory';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { MysqlClientRepository } from '@infrastructure/repositories/implementations/MysqlClientRepository';
import { MysqlPaymentRepository } from '@infrastructure/repositories/implementations/MysqlPaymentRepository';
import { MysqlSaleProductRepository } from '@infrastructure/repositories/implementations/MysqlSaleProductRepository';
import { MysqlSaleRepository } from '@infrastructure/repositories/implementations/MysqlSaleRepository';
import { MysqlSaleTypeRepository } from '@infrastructure/repositories/implementations/MysqlSaleTypeRepository';
import { MysqlUserRepository } from '@infrastructure/repositories/implementations/MysqlUserRepository';
import { IWebhookRepository } from '@infrastructure/repositories/IWebhookRepository';

@autoInjectable()
export class PostWebhookUseCase {
	constructor(
		@inject('IWebhookRepository') private readonly webhookRepository: IWebhookRepository,
		@inject('IAccountConfigurationRepository') private readonly accountConfiguration: IAccountConfigurationRepository,
		private readonly webhookFactory: WebhookFactory,
		private readonly saleFactory: SaleFactory,
		private readonly paymentFactory: PaymentFactory,
		private readonly saleProductFactory: SaleProductFactory,
		private readonly clientFactory: ClientFactory,
		@inject('ISaleTypeRepository') private readonly saleTypeRepository: MysqlSaleTypeRepository,
		@inject('IClientRepository') private readonly clientRepository: MysqlClientRepository,
		@inject('IPaymentRepository') private readonly paymentRepository: MysqlPaymentRepository,
		@inject('ISaleRepository') private readonly saleRepository: MysqlSaleRepository,
		@inject('ISaleProductRepository') private readonly saleProductRepository: MysqlSaleProductRepository,
		@inject('IUserRepository') private readonly userRepository: MysqlUserRepository
	) {}

	async saveWebhook(data?: any): Promise<Webhooks> {
		// const { limit, page, searchByEmail, searchByName, parentId } = data || {};

		const webhook = await this.webhookFactory.makeFromZspayWebhook(data);
		const newWebhook = await this.webhookRepository.save(webhook);

		// Executa uma ação com o webhook.

		return newWebhook;
	}

	async execute(webhook?: any): Promise<any> {
		const { data, type, status } = webhook;

		console.log(`Iniciando a execução do webhook`);
		switch (type) {
			case 'invoice':
				await this.invoiceProcess(data, status);
				break;
			case 'subscription':
				// await this.invoiceProcess(data, status);
				await this.systemSubscriptionProcess(data, status);
				console.log(`Method not implemented`);
				break;

			default:
				console.log(`Unknow process to webhook type ${type}`);
				break;
		}

		console.log(`Terminou a execução do webhook sem erros`);

		return '';
	}

	private async systemSubscriptionProcess(data: any, status: string): Promise<void> {
		// console.log(data);
		const isAccountConfiguration = await this.accountConfiguration.find({
			externalSignatureId: data.id,
		});
		// const { user } = isAccountConfiguration[0];
		if (isAccountConfiguration.length) {
			const { user } = isAccountConfiguration[0];
			switch (status) {
				case 'suspended':
					user.status = 'suspended';
					await this.userRepository.save(user);
					break;
				case 'updated':
				case 'overdue':
					// const status = ;
					user.status = data.status_assinatura_id === 5 ? 'overdue' : 'active';
					await this.userRepository.save(user);
					break;
				default:
					break;
			}
		}
	}

	private async invoiceProcess(data: any, status: string): Promise<void> {
		const isAccountConfiguration = await this.accountConfiguration.find({
			externalSignatureId: data.assinatura.id,
		});

		if (!isAccountConfiguration.length) {
			console.log(`Iremos tentar processar como uma venda de algum consultor.`);
			await this.salesProcess(data, status);
		} else {
			console.log(`Iremos tentar processar como um webhook de assinatura do sistema`);
			await this.subscriptionProcess(data, status, isAccountConfiguration[0]);
		}
	}

	private async subscriptionProcess(
		data: any,
		status: string,
		accountConfiguration: AccountConfiguration,
		@TransactionManager() manager?: EntityManager
	): Promise<void> {
		// if (accountConfiguration.next_due_date > data.assinatura.due_date) {
		// 	console.log(`Já foi executada essa atualização`);
		// 	return;
		// }

		let sale;
		let saleExists;
		const saleType = await this.saleTypeRepository.findByReference(2);

		const now = new Date();
		const admin = await this.userRepository.find({
			roleId: '8faaef5fee2c4189bbae7e29cfb07c29',
		});

		const admins = admin.map((v: any) => v.id);

		let client = await this.clientRepository.findByNationalRegistration(
			accountConfiguration.user.national_registration,
			admins
		);

		console.log(`Has client: ${!!client}`);

		if (!client) {
			console.log(`Cliente não encontrado, cadastrando um novo cliente`);
			client = await this.clientFactory.makeFromRegisterClientDTO({
				userId: admin[0].id,
				tradingName: accountConfiguration.user.trading_name,
				companyName: accountConfiguration.user.company_name,
				email: accountConfiguration.user.email,
				nationalRegistration: accountConfiguration.user.national_registration,
				gender: accountConfiguration.user.gender,
				birthDate: accountConfiguration.user.birth_date.toString(),
				address: {
					...accountConfiguration.user.address,
					postalCode: accountConfiguration.user.address.postal_code,
				},
				contacts: accountConfiguration.user.contact_link.contact.map((v: any) => {
					return {
						...v,
						// contactTypeId: v.contact_type.id,
					};
				}),
			});

			console.log(`Salvando cliente..`);
			await this.clientRepository.save(client, manager);
			console.log(`Cliente cadastrado.`);
		}

		switch (status) {
			case 'overdue':
			case 'paid':
				saleExists = await this.saleRepository.findSaleFromWebhook({
					externalPaymentId: data.id,
					saleType,
				});

				console.log(`Client Name: ${client.trading_name}`);

				if (!saleExists) {
					console.log(`Sale não encontrada, cadastrando uma nova.`);
					sale = await this.saleFactory.SaleFromWebhookRecurringSubscription(data, client, admin[0], manager);

					await this.saleRepository.save(sale, manager);
					console.log(`Salvando os produto da venda.`);
					// const saleProducts = await this.saleProductFactory.saleProductFromWebhookInvoice(sale);
					await this.saleProductRepository.save(
						await this.saleProductFactory.saleProductFromWebhookInvoice(sale),
						manager
					);

					await this.paymentRepository.save(await this.paymentFactory.makeFromWebhook(data, sale), manager);
					console.log(`Salvando o pagamento....`);

					accountConfiguration.next_due_date = new Date(now.setMonth(now.getMonth() + 1));
					await accountConfiguration.save();
					console.log(`Salvou a data da próxima recorrência: ${accountConfiguration.next_due_date}`);
				} else {
					console.log(`Já existe uma venda para esse webhook. Invoice ID : ${data.id}`);
				}

				if (status === 'overdue') {
					console.log('Mudando o status para overdue');
					accountConfiguration.user.status = 'overdue';
					await accountConfiguration.user.save();
				} else {
					console.log('Mudando o status para active');
					accountConfiguration.user.status = 'active';
					await accountConfiguration.user.save();
				}
				// console.log(sale);
				break;
			default:
				console.log(`Unknow process to ${status}`);
				break;
		}
	}

	private async salesProcess(data: any, status: string): Promise<any> {
		console.log(`Sale process`);
		const test = data;
		data = test;

		const statues2 = status;
		status = statues2;

		return '';
	}
}
