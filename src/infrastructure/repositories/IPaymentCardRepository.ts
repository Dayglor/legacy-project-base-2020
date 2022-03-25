import { PaymentCard } from '@infrastructure/database/entities/PaymentCard';
// import { IGetClientsDTO } from '@useCases/Clients/GetClients/GetClientsDTO';

export interface IPaymentCardRepository {
	// find(options: IGetClientsDTO): Promise<PaymentCard[]>;
	// findById(id: string): Promise<PaymentCard>;

	// findByEmail(email: string): Promise<PaymentCard>;
	save(paymentCard: PaymentCard): Promise<PaymentCard>;
	// delete(id: string): Promise<void>;
}
