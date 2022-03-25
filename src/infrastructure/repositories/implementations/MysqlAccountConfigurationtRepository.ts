import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository } from 'typeorm';

import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';

import { IAccountConfigurationRepository } from '../IAccountConfigurationRepository';

@autoInjectable()
export class MysqlAccountConfigurationRepository implements IAccountConfigurationRepository {
	private readonly accountConfiguration: Repository<AccountConfiguration>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.accountConfiguration = this.mysqlClient.getRepository(AccountConfiguration);
	}

	async save(accountConfiguration: any): Promise<AccountConfiguration> {
		const newMenu = await this.accountConfiguration.save(accountConfiguration);

		return newMenu;
	}

	async findById(id: string): Promise<AccountConfiguration> {
		const accountConfiguration = await this.accountConfiguration.findOne({ id }, { relations: ['user'] });

		return accountConfiguration;
	}

	async findByUserId(userId: string): Promise<AccountConfiguration> {
		const accountConfiguration = await this.accountConfiguration.findOne({
			where: {
				user: {
					id: userId,
				},
			},
			relations: ['user'],
		});

		return accountConfiguration;
	}

	async find(options?: any): Promise<AccountConfiguration[]> {
		// const { id } = options;
		const { limit, page, searchByEmail, searchByName, externalSignatureId, privateKey } = options;

		const skip = (+page - 1) * +limit;

		const where: any = {};

		if (searchByEmail) {
			where.email = searchByEmail;
		}

		if (searchByName) {
			where.name = Like(`%${searchByName}%`);
		}

		if (privateKey) {
			where.private_key = privateKey;
		}

		if (externalSignatureId) {
			where.external_signature_id = externalSignatureId;
		}

		const accountConfiguration = await this.accountConfiguration.find({
			where,
			skip,
			relations: ['user', 'user.address', 'user.contact_link', 'user.contact_link.contact'],
		});

		return accountConfiguration;
	}
}
