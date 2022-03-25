import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository } from 'typeorm';

import { UserBank } from '@infrastructure/database/entities/UserBank';

import { IUserBankRepository } from '../IUserBankRepository';

@autoInjectable()
export class MysqlUserBankRepository implements IUserBankRepository {
	private readonly userBankClient: Repository<UserBank>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.userBankClient = this.mysqlClient.getRepository(UserBank);
	}

	findById(id: string): Promise<UserBank> {
		const b = id;
		id = b;
		throw new Error('Method not implemented.');
	}
	findByReference(reference: number): Promise<UserBank> {
		const b = reference;
		reference = b;
		throw new Error('Method not implemented.');
	}
	findByName(name: string): Promise<UserBank> {
		const b = name;
		name = b;
		throw new Error('Method not implemented.');
	}

	async findByUserId(userId: any): Promise<UserBank> {
		const bank = await this.userBankClient.findOne({
			where: {
				user: userId,
			},
			relations: ['bank'],
		});

		return bank;
	}

	async findAll(): Promise<UserBank[]> {
		// const { name } = options;

		const where: any = {};

		// if (name) {
		// 	where.name = Like(`%${name}%`);
		// }

		const banks = await this.userBankClient.find({
			where,
		});

		return banks;
	}

	async find(options: any): Promise<UserBank[]> {
		const { name } = options;

		const where: any = {};

		if (name) {
			where.name = Like(`%${name}%`);
		}

		const banks = await this.userBankClient.find({
			where,
			order: {
				priority: 'ASC',
				name: 'ASC',
			},
		});

		return banks;
	}

	async save(dataBank: UserBank): Promise<UserBank> {
		const newBank = await this.userBankClient.save(dataBank);

		return newBank;
	}
}
