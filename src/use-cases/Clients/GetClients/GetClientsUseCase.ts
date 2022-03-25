import { autoInjectable, inject } from 'tsyringe';

import { Client } from '@infrastructure/database/entities/Client';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';

import { IGetClientsDTO } from './GetClientsDTO';

@autoInjectable()
export class GetClientsUseCase {
	constructor(@inject('IClientRepository') private readonly clientsRepository: IClientRepository) {}

	async execute(filter?: IGetClientsDTO): Promise<Client[]> {
		const { userId, limit, page, searchByEmail, searchByTradingName, nationalRegistration, parentId } = filter || {};
		const clients = await this.clientsRepository.find({
			userId,
			parentId,
			limit,
			page,
			searchByEmail,
			searchByTradingName,
			nationalRegistration,
		});

		return clients;
	}
}
