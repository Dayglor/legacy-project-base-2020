import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository } from 'typeorm';

import { Bank } from '@infrastructure/database/entities/Bank';

import { IBankRepository } from '../IBankRepository';

@autoInjectable()
export class MysqlBankRepository implements IBankRepository {
	private readonly bankClient: Repository<Bank>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.bankClient = this.mysqlClient.getRepository(Bank);
	}

	async findAll(): Promise<Bank[]> {
		// const { name } = options;

		const where: any = {};

		// if (name) {
		// 	where.name = Like(`%${name}%`);
		// }

		const banks = await this.bankClient.find({
			where,
		});

		return banks;
	}

	async find(options: any): Promise<Bank[]> {
		const { name } = options;

		const where: any = {};

		if (name) {
			where.name = Like(`%${name}%`);
		}

		const banks = await this.bankClient.find({
			where,
			order: {
				priority: 'ASC',
				name: 'ASC',
			},
		});

		return banks;
	}

	async save(Bank: Bank): Promise<Bank> {
		const newBank = await this.bankClient.save(Bank);

		return newBank;
	}
}
