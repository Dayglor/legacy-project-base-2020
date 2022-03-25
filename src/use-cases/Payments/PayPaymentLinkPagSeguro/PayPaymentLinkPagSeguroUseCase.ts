import { autoInjectable, inject } from 'tsyringe';
// import { EntityManager, Transaction, TransactionManager } from 'typeorm';

import { EntityManager, Transaction, TransactionManager } from 'typeorm';

import { Receivable } from '@infrastructure/database/entities/Receivable';
import { PagSeguroPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/pagseguro/PagSeguroPaymentGatewayProvider';
import { ReceivableFactory } from '@infrastructure/factories/ReceivableFactory';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IPaymentRepository } from '@infrastructure/repositories/IPaymentRepository';
import { IReceivableRepository } from '@infrastructure/repositories/IReceivableRepository';
import { ISaleRepository } from '@infrastructure/repositories/ISaleRepository';
import { Utils } from '@infrastructure/utils';

import { IPayPaymentLinkPagSeguroDTO } from './PayPaymentLinkPagSeguroDTO';

@autoInjectable()
export class PayPaymentLinkPagSeguroUseCase {
	constructor(
		@inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
		@inject('ISaleRepository') private readonly saleRepository: ISaleRepository,
		@inject('IReceivableRepository') private readonly receivableRepository: IReceivableRepository,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly pagSeguroPaymentGatewayProvider: PagSeguroPaymentGatewayProvider,
		private readonly receivableFactory: ReceivableFactory
	) {}

	@Transaction()
	async execute(data: IPayPaymentLinkPagSeguroDTO, @TransactionManager() manager?: EntityManager): Promise<Payment> {
		const {
			paymentId,
			cardOwner,
			cardNationalRegistration,
			cardPhone,
			cardBirthDate,
			installments,
			installmentAmount,
			senderHash,
			creditCardToken,
		} = data;

		const payment = await this.paymentRepository.findById(paymentId, manager);

		if (payment.status !== 'pending') {
			throw new Error('O status do pagamento não é pendente.');
		}

		const sale = await this.saleRepository.findById(payment.sale.id, manager);

		const userConfig = await this.accountConfigurationRepository.findByUserId(sale.user.id);

		if (!userConfig?.private_key || !userConfig?.token) {
			throw new Error('Usuário não tem permissão para Link de Pagamento.');
		}

		if (!payment.max_installments || payment.max_installments < 2) {
			payment.max_installments = 2;
		}

		const creditCardSaleData = {
			cardOwner,
			cardNationalRegistration,
			cardPhone,
			cardBirthDate,
			amount: payment.amount,
			installments,
			installmentAmount,
			senderHash,
			creditCardToken,
			sale,
			noInterestInstallmentQuantity: payment.max_installments,
		};

		await this.pagSeguroPaymentGatewayProvider.initialize(userConfig.private_key, userConfig.token);

		const result = await this.pagSeguroPaymentGatewayProvider.createCreditCardSale(creditCardSaleData);
		if (!result?.transaction?.code) {
			throw new Error('Error generating payment.');
		}

		const { code, date, status, grossAmount, feeAmount, netAmount, discountAmount, extraAmount, installmentCount } =
			result.transaction;

		const receivables = await this.receivableFactory.makeFromPagSeguroTransaction({
			code,
			installmentCount,
			grossAmount,
			netAmount,
			feeAmount,
			discountAmount,
			extraAmount,
			status,
			date,
		});

		await Utils.forEachAsync2(receivables, async (receivable: Receivable) => {
			receivable.payment = <any>payment.id;
			await this.receivableRepository.save(receivable, manager);
		});

		payment.status = 'waiting_payment';
		payment.external_id = result?.transaction?.code;
		await this.paymentRepository.save(payment, manager);

		const paymentResult = await this.paymentRepository.findById(paymentId, manager);

		return paymentResult;
	}
}
