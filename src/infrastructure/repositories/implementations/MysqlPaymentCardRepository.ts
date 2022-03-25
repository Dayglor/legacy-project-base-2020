import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { PaymentCard } from '@infrastructure/database/entities/PaymentCard';

import { IPaymentCardRepository } from '../IPaymentCardRepository';

@autoInjectable()
export class MysqlPaymentCardRepository implements IPaymentCardRepository {
	private readonly paymentCardClient: Repository<PaymentCard>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.paymentCardClient = this.mysqlClient.getRepository(PaymentCard);
	}

	async save(paymentCard: PaymentCard): Promise<PaymentCard> {
		const newPaymentCard = await this.paymentCardClient.save(paymentCard);

		return newPaymentCard;
	}
}
