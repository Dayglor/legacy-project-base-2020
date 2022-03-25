import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { Card } from '@infrastructure/database/entities/Card';
// import { IGetClientsDTO } from '@useCases/Clients/GetClients/GetClientsDTO';

import { ICardRepository } from '../ICardRepository';

@autoInjectable()
export class MysqlCardRepository implements ICardRepository {
	private readonly cardClient: Repository<Card>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.cardClient = this.mysqlClient.getRepository(Card);
	}

	async save(card: Card): Promise<Card> {
		const newCard = await this.cardClient.save(card);

		return newCard;
	}
}
