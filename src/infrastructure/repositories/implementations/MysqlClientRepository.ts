import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, In, Like, Repository, getManager } from 'typeorm';

import { Client } from '@infrastructure/database/entities/Client';
import { IGetClientsDTO } from '@useCases/Clients/GetClients/GetClientsDTO';

import { IClientRepository } from '../IClientRepository';

@autoInjectable()
export class MysqlClientRepository implements IClientRepository {
	private readonly clientClient: Repository<Client>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.clientClient = this.mysqlClient.getRepository(Client);
	}

	async findByEmail(email: string): Promise<Client> {
		const client = await this.clientClient.findOne(
			{ email },
			{
				relations: ['address', 'contact_link', 'contact_link.contact', 'sale'],
			}
		);

		return client;
	}

	async find(options: IGetClientsDTO): Promise<Client[]> {
		const { userId, parentId, limit, page, searchByEmail, searchByTradingName, nationalRegistration } = options;

		const skip = (+page - 1) * +limit;

		const where: any = {};

		if (userId && !parentId) {
			where.user = <any>userId;
		}

		if (userId && parentId) {
			where.user = In([userId, parentId]);
		}

		if (searchByEmail) {
			where.email = Like(`%${searchByEmail}%`);
		}

		if (searchByTradingName) {
			where.trading_name = Like(`%${searchByTradingName}%`);
		}

		if (nationalRegistration) {
			where.national_registration = nationalRegistration.replace(/\D/g, '');
		}

		const clients = await this.clientClient.find({
			where,
			relations: ['address', 'contact_link', 'contact_link.contact', 'sale'],
			skip,
			take: limit,
			order: { created: 'DESC' },
		});

		return clients;
	}

	async findById(id: string, manager?: EntityManager): Promise<Client> {
		let dbClient: any = this.clientClient;
		if (manager) {
			dbClient = manager.getRepository(Client);
		}
		const client = await dbClient.findOne(
			{ id },
			{
				relations: [
					'address',
					'contact_link',
					'contact_link.contact',
					'contact_link.contact.contact_type',
					'sale',
					'sale.user',
					'sale.payments',
					'sale.payments.payment_type',
				],
			}
		);

		return client;
	}

	async findByNationalRegistration(nationalRegistration: string, parent?: any): Promise<Client> {
		const where: any = {};

		if (nationalRegistration) {
			where.national_registration = nationalRegistration;
		}

		if (parent) {
			where.user = parent;
		}

		const client = await this.clientClient
			.createQueryBuilder('client')
			.where('client.user_id IN (:...user_id)', { user_id: parent })
			.andWhere(`client.national_registration = ${nationalRegistration}`)
			.getOne();
		return client;
	}
	async findByNationalRegistrationAndParentId(nationalRegistration: string, userId: string): Promise<Client> {
		// const client = await this.clientClient.findOne(
		// 	{ national_registration: nationalRegistration },
		// 	{
		// 		relations: ['user'],
		// 	}
		// );

		let client: any = this.clientClient
			.createQueryBuilder('client')
			// .take(limit)
			// .skip(skip)
			.leftJoinAndSelect('client.user', 'user')
			.orderBy('client.created', 'DESC');

		if (nationalRegistration) {
			// client.leftJoinAndSelect('sale.client', `client.name LIKE "% :client %"`, { client });
			// client.leftJoinAndSelect('sale.client', `client.name LIKE %${client}%`);
			client = client.andWhere(`client.national_registration = "${nationalRegistration}"`);
		}

		if (userId) {
			// client.leftJoinAndSelect('sale.client', `client.name LIKE "% :client %"`, { client });
			// client.leftJoinAndSelect('sale.client', `client.name LIKE %${client}%`);
			client = client.andWhere(`user.id = "${userId}"`);
		}

		const clientExists = await client.getOne();

		return clientExists;
	}

	async delete(id: string): Promise<void> {
		await this.clientClient.softDelete({ id });
	}

	async save(client: Client, manager?: EntityManager): Promise<Client> {
		let dbClient: any = manager;
		if (!dbClient) {
			dbClient = this.clientClient;
		}
		const newClient = await dbClient.save(client);

		return newClient;
	}

	async totalClients(userId: string): Promise<number> {
		const clients = await this.clientClient.count({ user: <any>userId });

		return clients;
	}

	async findBirthdays(userId: string): Promise<Client[]> {
		const entityManager = getManager();

		const clients = await entityManager.query(
			`SELECT * FROM clients
				WHERE 
					user_id = '${userId}' AND
					removed IS NULL AND
					birth_date <> '0000-00-00'
				ORDER BY
					MONTH(birth_date),
					DAY(birth_date)`
		);

		return clients;
	}
}
