import { EntityManager } from 'typeorm';

import { Client } from '@infrastructure/database/entities/Client';
import { IGetClientsDTO } from '@useCases/Clients/GetClients/GetClientsDTO';

export interface IClientRepository {
	find(options: IGetClientsDTO): Promise<Client[]>;
	findById(id: string, manager?: EntityManager): Promise<Client>;
	findByNationalRegistration(nationalRegistration: string): Promise<Client>;
	findByNationalRegistrationAndParentId(nationalRegistration: string, userId: string): Promise<Client>;
	findByEmail(email: string): Promise<Client>;
	save(client: Client, manager?: EntityManager): Promise<Client>;
	delete(id: string): Promise<void>;
	totalClients(userId: string): Promise<number>;
	findBirthdays(userId: string): Promise<Client[]>;
}
