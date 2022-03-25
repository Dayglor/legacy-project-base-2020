import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { Payment } from '../../database/entities/Payment';
import { IPaymentRepository } from '../IPaymentRepository';

@autoInjectable()
export class MysqlPaymentRepository implements IPaymentRepository {
	private readonly paymentClient: Repository<Payment>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.paymentClient = this.mysqlClient.getRepository(Payment);
	}
	async find(options: any): Promise<Payment[]> {
		const { limit, page, externalId } = options;
		const skip = (+page - 1) * +limit;

		const where: any = {};

		if (externalId) {
			where.external_id = externalId;
		}

		const payments = await this.paymentClient.find({
			where,
			skip,
			take: limit,
		});

		return payments;
	}

	async findById(id: string, manager?: EntityManager): Promise<Payment> {
		let client: any = this.paymentClient;
		if (manager) {
			client = manager.getRepository(Payment);
		}
		const payment = await client.findOne(
			{
				id,
			},
			{
				relations: [
					'payment_ticket',
					'payment_type',
					'receivables',
					'sale',
					'sale.saleProduct',
					'sale.saleProduct.product',
					'sale.user',
					'sale.client',
				],
			}
		);

		return payment;
	}

	async save(payment: Payment, manager?: EntityManager): Promise<Payment> {
		let client: any = manager;
		if (!client) {
			client = this.paymentClient;
		}
		const newPayment = await client.save(payment);

		return newPayment;
	}
}
