import { autoInjectable, inject } from 'tsyringe';

import { Client } from '@infrastructure/database/entities/Client';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';

import { IGetClientDTO } from './GetClientDTO';

@autoInjectable()
export class GetClientUseCase {
	constructor(@inject('IClientRepository') private readonly clientRepository: IClientRepository) {}

	async execute(data: IGetClientDTO): Promise<Client> {
		const client = await this.clientRepository.findById(data.id);
		if (!client) {
			throw Error('Não encontrado');
		}
		return client;
	}
}
