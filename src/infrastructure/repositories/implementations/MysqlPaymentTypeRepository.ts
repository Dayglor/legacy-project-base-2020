import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { PaymentType } from '../../database/entities/PaymentType';
import { IPaymentTypeRepository } from '../IPaymentTypeRepository';

@autoInjectable()
export class MysqlPaymentTypeRepository implements IPaymentTypeRepository {
	private readonly paymentTypeClient: Repository<PaymentType>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.paymentTypeClient = this.mysqlClient.getRepository(PaymentType);
	}
	async find(options: any): Promise<PaymentType[]> {
		const { limit, page } = options || {};
		const skip = (+page - 1) * +limit;

		const paymentTypes = await this.paymentTypeClient.find({
			skip,
			take: limit,
			order: {
				name: 'ASC',
			},
		});

		return paymentTypes;
	}

	async findById(id: string): Promise<PaymentType> {
		const paymentType = await this.paymentTypeClient.findOne({ id });

		return paymentType;
	}

	async findByReference(reference: number): Promise<PaymentType> {
		const paymentType = await this.paymentTypeClient.findOne({ reference });

		return paymentType;
	}

	async save(paymentType: PaymentType): Promise<PaymentType> {
		const newPaymentType = await this.paymentTypeClient.save(paymentType);

		return newPaymentType;
	}
}
