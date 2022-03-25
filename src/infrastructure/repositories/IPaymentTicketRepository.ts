import { EntityManager } from 'typeorm';

import { PaymentTicket } from '../database/entities/PaymentTicket';

export interface IPaymentTicketRepository {
	find(options?: any): Promise<PaymentTicket[]>;
	findById(id: string): Promise<PaymentTicket>;
	save(paymentTicket: PaymentTicket, manager?: EntityManager): Promise<PaymentTicket>;
}
