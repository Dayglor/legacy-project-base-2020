import { autoInjectable, inject } from 'tsyringe';

import { Payment } from '@infrastructure/database/entities/Payment';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';
import { IPaymentRepository } from '@infrastructure/repositories/IPaymentRepository';

@autoInjectable()
export class GetPaymentUseCase {
	constructor(
		@inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
		@inject('IClientRepository') private readonly clientRepository: IClientRepository
	) {}

	async execute(id: string): Promise<Payment> {
		const payment = await this.paymentRepository.findById(id);
		const client = await this.clientRepository.findById(payment.sale.client.id);

		payment.sale.client = client;

		return payment;
	}
}
