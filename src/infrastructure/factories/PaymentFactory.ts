import { autoInjectable, inject } from 'tsyringe';

import { Payment } from '@infrastructure/database/entities/Payment';
import { PaymentTicket } from '@infrastructure/database/entities/PaymentTicket';
import { Sale } from '@infrastructure/database/entities/Sale';
import { SaleProduct } from '@infrastructure/database/entities/SaleProduct';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IPaymentTypeRepository } from '@infrastructure/repositories/IPaymentTypeRepository';
import { Utils } from '@infrastructure/utils';
import { IRegisterSalePayment } from '@useCases/Sales/RegisterSale/RegisterSaleDTO';
import { IBuyScoreDTO } from '@useCases/Scores/BuyScores/BuyScoresDTO';

@autoInjectable()
export class PaymentFactory {
	constructor(
		@inject('IPaymentTypeRepository') private readonly paymentTypeRepository: IPaymentTypeRepository,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository
	) {}

	async makeFromRegisterSalePaymentDTO(data: IRegisterSalePayment[], userId?: string): Promise<Payment[]> {
		const payments = [];
		await Utils.forEachAsync2(data, async (payment: IRegisterSalePayment) => {
			const { amount, installments, paymentType: paymentTypeReference } = payment;
			if (!paymentTypeReference) {
				throw new Error('paymentType should not be empty.');
			}
			const newPayment = new Payment();

			payment.id = newPayment.id;

			const paymentType = await this.paymentTypeRepository.findByReference(paymentTypeReference);

			if (!paymentType) {
				throw new Error(`paymentType ${paymentTypeReference} not found.`);
			}

			newPayment.amount = amount * 100;
			newPayment.installments = installments || 1;
			newPayment.payment_type = paymentType;
			newPayment.check_date = null;
			switch (paymentTypeReference) {
				case 1:
				case 2: {
					// Crédito e Débito
					const { authorizationCode } = payment;
					// if (!authorizationCode) {
					// 	throw new Error(`(PaymentType: ${paymentTypeReference}) - authorizationCode should not be empty.`);
					// }
					newPayment.authorization_code = authorizationCode;
					newPayment.gateway = 'pagseguro';
					newPayment.status = 'approved';
					break;
				}
				case 3: {
					// Boleto
					const { interest, lateFee, dueDate } = payment; // generateBillets, sendEmail
					const paymentTicket = new PaymentTicket();
					if (!dueDate) {
						throw new Error('(PaymentType: 3) - Data de vencimento não pode ser vazia.');
					}
					paymentTicket.due_date = Utils.dateToDbDate(dueDate);
					paymentTicket.interest = interest;
					paymentTicket.late_fee = lateFee;
					paymentTicket.payment = newPayment;

					newPayment.payment_ticket = paymentTicket;
					break;
				}
				case 4: {
					// Recorrência
					const { maxInstallments } = payment;
					newPayment.max_installments = maxInstallments || 0;
					newPayment.gateway = 'zspay';
					break;
				}
				case 5: {
					// Link de Pagamento
					const userConfig = await this.accountConfigurationRepository.findByUserId(userId);

					if (!userConfig?.private_key || !userConfig?.token) {
						throw new Error('Usuário não tem permissão para Link de Pagamento.');
					}

					const { maxInstallments, expirationDate } = payment;
					if (!expirationDate) {
						throw new Error('(PaymentType: 5) - Data de expiração não pode ser vazia.');
					}
					newPayment.expiration_date = Utils.dateToDbDate(expirationDate);
					newPayment.max_installments = maxInstallments || 12;
					newPayment.gateway = 'pagseguro';
					// newPayment.external_id =
					break;
				}
				case 6: {
					// Cheque
					const { checkNumber } = payment;
					// if (!checkNumber) {
					// 	throw new Error('(PaymentType: 6) - checkNumber should not be empty.');
					// }
					newPayment.check_number = checkNumber;
					newPayment.check_date = Utils.dateToDbDate(payment.date);
					newPayment.bank = <any>payment.bankId;
					newPayment.gateway = 'bank_check';
					newPayment.status = 'approved';
					break;
				}
				case 7: {
					// Dinheiro
					newPayment.gateway = 'money';
					newPayment.status = 'approved';
					break;
				}
				default:
					throw new Error(`Payment Type ${paymentTypeReference} not found.`);
			}

			payments.push(newPayment);
		});

		return payments;
	}

	async makePaymentsFromLoopBuyScore(
		sale: Sale,
		saleProducts: SaleProduct,
		data: IBuyScoreDTO,
		installment: number
	): Promise<Payment> {
		const paymentType = await this.paymentTypeRepository.findById('0de1c336d8ff4786a3307be1b4dcc32c');
		if (!paymentType) {
			throw new Error('Payment Type "0de1c336d8ff4786a3307be1b4dcc32c" not found');
		}

		const payment = new Payment();
		payment.payment_type = paymentType;
		payment.status = 'pending';
		payment.sale = sale;
		payment.amount = +data.amount / 100 / data.installments;
		payment.fee = 0;
		payment.amount_received = 0;
		payment.installments = installment + 1;

		return payment;
	}

	async makeFromWebhook(data: any, sale: Sale): Promise<Payment> {
		const paymentType = await this.paymentTypeRepository.findByReference(4);
		if (!paymentType) {
			throw new Error('Payment Type REFERENCE "4" not found');
		}

		const paymentDate = new Date(data.date_invoice);
		const payment = new Payment();
		payment.status = data.status === 'paid' ? 'approved' : 'overdue';
		payment.payment_type = paymentType;
		// payment.external_payment_date = data.paid_at;
		payment.external_id = data.id;
		payment.external_payment_date = new Date(paymentDate.setHours(paymentDate.getHours() + 3));
		payment.sale = sale;
		payment.amount = data.amount;
		payment.fee = 0;
		payment.amount_received = 0;
		payment.installments = 1;

		return payment;
	}
}
