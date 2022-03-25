import { Card } from '@infrastructure/database/entities/Card';
// import { IGetClientsDTO } from '@useCases/Clients/GetClients/GetClientsDTO';

export interface ICardRepository {
	// find(options: IGetClientsDTO): Promise<Card[]>;
	// findById(id: string): Promise<Card>;

	// findByEmail(email: string): Promise<Card>;
	save(card: Card): Promise<Card>;
	// delete(id: string): Promise<void>;
}
