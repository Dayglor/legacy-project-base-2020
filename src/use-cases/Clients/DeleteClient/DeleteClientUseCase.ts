import { autoInjectable, inject } from 'tsyringe';

import { IClientRepository } from '@infrastructure/repositories/IClientRepository';

import { IDeleteClientDTO } from './DeleteClientDTO';

@autoInjectable()
export class DeleteClientUseCase {
	constructor(@inject('IClientRepository') private readonly clientRepository: IClientRepository) {}

	async execute(data: IDeleteClientDTO): Promise<void> {
		const client = await this.clientRepository.findById(data.id);

		if (!client) {
			throw Error('Não encontrado');
		}

		await this.clientRepository.delete(data.id);
	}
}
