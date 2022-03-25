import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { UserQueryHistory } from '@infrastructure/database/entities/UserQueryHistory';

import { IUserQueryHistoryRepository } from '../IUserQueryHistoryRepository';

@autoInjectable()
export class MysqlUserQueryHistoryRepository implements IUserQueryHistoryRepository {
	private readonly userQueryHistory: Repository<UserQueryHistory>;
	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.userQueryHistory = this.mysqlClient.getRepository(UserQueryHistory);
	}

	async count(options: any): Promise<number> {
		const { limit, page, status, user } = options;
		const skip = (+page - 1) * +limit;

		const whereToFind = {
			skip,
			take: limit,
			where: <any>{},
			// relations: ['address', 'contact_link', 'document_link', 'contact_link.contact', 'document_link.document'],
		};

		if (status) {
			whereToFind.where.status = status;
		}

		if (user) {
			whereToFind.where.user_id = user;
		}

		const count = await this.userQueryHistory.count(whereToFind);

		return count;
	}

	async find(options: any): Promise<UserQueryHistory[]> {
		const { limit, page, where, order } = options;
		const skip = (+page - 1) * +limit;

		const whereToFind = {
			skip,
			take: limit,
			where,
			order,
			// relations: ['address', 'contact_link', 'document_link', 'contact_link.contact', 'document_link.document'],
		};

		const usersQuery = await this.userQueryHistory.find(whereToFind);

		return usersQuery;
	}

	async findById(id: string): Promise<UserQueryHistory> {
		const query = await this.userQueryHistory.findOne({ where: { id }, relations: ['user'] });

		return query;
	}

	async save(userQuery: UserQueryHistory): Promise<UserQueryHistory> {
		const newUserQuery = await this.userQueryHistory.save(userQuery);

		return newUserQuery;
	}

	async delete(id: string): Promise<any> {
		const userQuery = await this.userQueryHistory.softDelete({ id });
		console.log(`UserQuery deleted: ${userQuery}`, userQuery.raw);
		return !!userQuery.raw.changedRows;
	}
}
