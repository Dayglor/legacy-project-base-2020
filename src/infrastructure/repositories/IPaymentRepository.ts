import { EntityManager } from 'typeorm';

import { Payment } from '../database/entities/Payment';

export interface IPaymentRepository {
	find(options?: any): Promise<Payment[]>;
	findById(id: string, manager?: EntityManager): Promise<Payment>;
	save(payment: Payment, manager?: EntityManager): Promise<Payment>;
}
