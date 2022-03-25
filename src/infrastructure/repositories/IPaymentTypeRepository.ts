import { PaymentType } from '../database/entities/PaymentType';

export interface IPaymentTypeRepository {
	find(options?: any): Promise<PaymentType[]>;
	findById(id: string): Promise<PaymentType>;
	findByReference(reference: number): Promise<PaymentType>;
	save(address: PaymentType): Promise<PaymentType>;
}
