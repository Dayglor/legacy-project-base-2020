import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { PaymentTicket } from '../../database/entities/PaymentTicket';
import { IPaymentTicketRepository } from '../IPaymentTicketRepository';

@autoInjectable()
export class MysqlPaymentTicketRepository implements IPaymentTicketRepository {
	private readonly paymentTicketClient: Repository<PaymentTicket>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.paymentTicketClient = this.mysqlClient.getRepository(PaymentTicket);
	}
	async find(options: any): Promise<PaymentTicket[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const paymentTickets = await this.paymentTicketClient.find({
			skip,
			take: limit,
		});

		return paymentTickets;
	}

	async findById(id: string): Promise<PaymentTicket> {
		const paymentTicket = await this.paymentTicketClient.findOne({ id });

		return paymentTicket;
	}

	async save(paymentTicket: PaymentTicket, manager?: EntityManager): Promise<PaymentTicket> {
		let client: any = manager;
		if (!client) {
			client = this.paymentTicketClient;
		}
		const newPaymentTicket = await client.save(paymentTicket);

		return newPaymentTicket;
	}
}
