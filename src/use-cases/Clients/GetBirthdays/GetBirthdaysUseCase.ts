import { autoInjectable, inject } from 'tsyringe';

import { Client } from '@infrastructure/database/entities/Client';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';
import { Utils } from '@infrastructure/utils';

import { IGetBirthdaysDTO } from './GetBirthdaysDTO';

@autoInjectable()
export class GetBirthdaysUseCase {
	constructor(@inject('IClientRepository') private readonly clientsRepository: IClientRepository) {}

	async execute(filter?: IGetBirthdaysDTO): Promise<Client[]> {
		const { userId } = filter || {};

		const clients = await this.clientsRepository.findBirthdays(userId);

		const data = new Date();
		const currentDay = String(data.getDate()).padStart(2, '0');
		const currentMonth = String(data.getMonth() + 1).padStart(2, '0');

		data.setMonth(data.getMonth() + 6);
		const limitMonth = String(data.getMonth() + 1).padStart(2, '0');

		let clientsAux = [];
		let limit = 0;

		await Utils.forEachAsync2(clients, async (client: any) => {
			if (limit < 10) {
				const month = String(client.birth_date.getMonth() + 1).padStart(2, '0');
				const day = String(client.birth_date.getDate()).padStart(2, '0');

				if (month === currentMonth) {
					if (day === currentDay || day > currentDay) {
						clientsAux = [...clientsAux, client];
						limit += 1;
					}
				} else if (month > currentMonth) {
					clientsAux = [...clientsAux, client];
					limit += 1;
				}
			}
		});

		if (limit < 10) {
			await Utils.forEachAsync2(clients, async (client: any) => {
				const month = String(client.birth_date.getMonth() + 1).padStart(2, '0');
				if (limit < 10 && !(clients.length === limit + 1)) {
					if (month < limitMonth) {
						clientsAux = [...clientsAux, client];
						limit += 1;
					}
				}
			});
		}

		return clientsAux;
	}
}
