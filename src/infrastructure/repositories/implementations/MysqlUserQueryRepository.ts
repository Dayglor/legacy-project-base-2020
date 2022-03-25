import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { UserQuery } from '@infrastructure/database/entities/UserQuery';

import { IUserQueryRepository } from '../IUserQueryRepository';

@autoInjectable()
export class MysqlUserQueryRepository implements IUserQueryRepository {
	private readonly userQueryClient: Repository<UserQuery>;
	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.userQueryClient = this.mysqlClient.getRepository(UserQuery);
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

		const count = await this.userQueryClient.count(whereToFind);

		return count;
	}

	async find(options: any): Promise<UserQuery[]> {
		const { limit, page, where } = options;
		const skip = (+page - 1) * +limit;

		const whereToFind = {
			skip,
			take: limit,
			where,
			// relations: ['address', 'contact_link', 'document_link', 'contact_link.contact', 'document_link.document'],
		};
		const usersQuery = await this.userQueryClient.find(whereToFind);

		return usersQuery;
	}

	async findById(id: string): Promise<UserQuery> {
		const query = await this.userQueryClient.findOne({ id });

		return query;
	}

	async save(userQuery: UserQuery): Promise<UserQuery> {
		const newUserQuery = await this.userQueryClient.save(userQuery);

		return newUserQuery;
	}

	async deleteOldFreeQuery(data: any): Promise<any> {
		const userQuery = await this.userQueryClient.softDelete(data);
		console.log(`UserQuery (softDelete) deleted: ${userQuery}`, userQuery.raw);
		return !!userQuery.raw.changedRows;
	}

	async delete(id: string): Promise<any> {
		const userQuery = await this.userQueryClient.softDelete({ id });
		console.log(`UserQuery deleted: ${userQuery}`, userQuery.raw);
		return !!userQuery.raw.changedRows;
	}
}
