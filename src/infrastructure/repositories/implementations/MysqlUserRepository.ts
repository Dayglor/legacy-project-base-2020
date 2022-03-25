import { autoInjectable, inject } from 'tsyringe';
import { Connection, FindOneOptions, In, Like, Repository, Not, EntityManager } from 'typeorm';

import { User } from '@infrastructure/database/entities/User';
import { IListUserDTO } from '@useCases/Users/ListUsers/ListUsersDTO';

import { IUserRepository } from '../IUserRepository';

@autoInjectable()
export class MysqlUserRepository implements IUserRepository {
	private readonly userClient: Repository<User>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.userClient = this.mysqlClient.getRepository(User);
	}
	async find(options: any): Promise<User[]> {
		const { limit, page, status, name, email, parentId, roleId } = options;
		const skip = (+page - 1) * +limit;

		const where: any = {};

		if (status) {
			where.status = status;
		}

		if (name) {
			where.trading_name = Like(`%${name}%`);
		}

		if (email) {
			where.email = Like(`%${email}%`);
		}

		if (parentId) {
			where.parent = <any>parentId;
		}

		if (roleId) {
			where.role = <any>roleId;
		}

		// const whereToFind = {
		// 	skip,
		// 	take: limit,
		// 	where: {},
		// 	relations: [
		// 		'address',
		// 		'majority_member',
		// 		'majority_member.address',
		// 		'majority_member.contact_link',
		// 		'majority_member.contact_link.contact',
		// 		'contact_link',
		// 		'document_link',
		// 		'contact_link.contact',
		// 		'document_link.document',
		// 	],
		// 	order: {
		// 		'created': 'DESC',
		// 	},
		// };

		const users = await this.userClient.find({
			skip,
			take: limit,
			where,
			relations: [
				'address',
				'majority_member',
				'majority_member.address',
				'majority_member.contact_link',
				'majority_member.contact_link.contact',
				'contact_link',
				'document_link',
				'contact_link.contact',
				'document_link.document',
				'parent',
				// 'child'
			],
			order: {
				created: 'DESC',
			},
		});

		return users;
	}

	async findChildren(options: any): Promise<User[]> {
		const { limit, page, parentId, searchByEmail, searchByName } = options;

		const skip = (+page - 1) * +limit;

		const where: any = {};

		where.parent = parentId;

		if (searchByEmail) {
			where.email = Like(`%${searchByEmail}%`);
		}

		if (searchByName) {
			where.trading_name = Like(`%${searchByName}%`);
		}

		const users = await this.userClient.find({
			skip,
			take: limit,
			where,
			relations: [
				'address',
				'majority_member',
				'majority_member.address',
				'majority_member.contact_link',
				'majority_member.contact_link.contact',
				'contact_link',
				'document_link',
				'contact_link.contact',
				'document_link.document',
			],
			order: {
				created: 'DESC',
			},
		});

		return users;
	}

	// async findBirthDays(options: any): Promise<User[]> {

	// 	const where: any = {
	// 		status: In(['approved', 'active', 'overdue', 'disabled']),
	// 	};

	// 	const users = await this.userClient.find({
	// 		where,
	// 		order: {
	// 			created: 'DESC',
	// 		},
	// 	});

	// 	return users;
	// }

	async findChild(options: any): Promise<User> {
		const { id, parentId } = options;

		const user = await this.userClient.findOne({
			where: {
				id,
				parent: parentId,
			},
			relations: [
				'address',
				'majority_member',
				'majority_member.address',
				'majority_member.contact_link',
				'majority_member.contact_link.contact',
				'contact_link',
				'document_link',
				'contact_link.contact',
				'document_link.document',
			],
		});

		return user;
	}

	async findById(id: string): Promise<User> {
		const user = await this.userClient.findOne(
			{ id },
			{
				relations: [
					'role',
					'address',
					'majority_member',
					'majority_member.address',
					'majority_member.contact_link',
					'majority_member.contact_link.contact',
					'document_link',
					'contact_link',
					'contact_link.contact',
					'contact_link.contact.contact_type',
					'document_link.document',
					'account_configuration',
					'parent',
					// 'child'
				],
			}
		);

		return user;
	}

	async findByIds(usersIds: string[]): Promise<User[]> {
		const users = await this.userClient.find({
			where: {
				id: In(usersIds),
			},
		});

		return users;
	}

	async findPreRegisterById(id: string): Promise<User> {
		const user = await this.userClient.findOne(
			{ id, status: 'pre-register' },
			{
				relations: [
					'role',
					'address',
					'majority_member',
					'majority_member.address',
					'majority_member.contact_link',
					'majority_member.contact_link.contact',
					'document_link',
					'contact_link',
					'contact_link.contact',
					'contact_link.contact.contact_type',
					'document_link.document',
				],
			}
			// { relations: ['role', 'document_link', 'contact_link', 'contact_link.contact'] }
		);

		return user;
	}

	async count(options: any): Promise<number> {
		const { limit, page, status, name, email } = options;
		const skip = (+page - 1) * +limit;

		const dataWhere: any = {};
		const dataToFind = {
			skip,
			take: limit,
			where: {},
		};

		if (status) {
			dataWhere.status = status;
		}

		if (name) {
			dataWhere.trading_name = <any>Like(`%${name}%`);
		}

		if (email) {
			dataWhere.email = <any>Like(`%${email}%`);
		}
		dataToFind.where = dataWhere;
		const users = await this.userClient.count(dataToFind);

		return users;
	}

	async findByEmail(email: string, options?: any): Promise<User> {
		const queryOptions: FindOneOptions = {};

		if (options?.role) {
			queryOptions.relations = ['role'];
		}

		const user = await this.userClient.findOne({ email }, queryOptions);

		return user;
	}

	async findByNationalRegistration(nationalRegistration: string, options?: any): Promise<User> {
		const queryOptions: FindOneOptions = {};

		if (options?.role) {
			queryOptions.relations = ['role'];
		}

		const user = await this.userClient.findOne({ national_registration: nationalRegistration }, queryOptions);

		return user;
	}

	async save(user: User, manager?: EntityManager): Promise<User> {
		let client: any = manager;
		if (!client) {
			client = this.userClient;
		}
		const newUser = await client.save(user);

		return newUser;
	}

	async delete(id: string): Promise<boolean> {
		const user = await this.userClient.softDelete({ id });
		console.log(`User deleted: ${user}`, user.raw);
		return !!user.raw.changedRows;
	}

	async updateStatus(id: string, status: string): Promise<User> {
		const user = await this.userClient.findOne({ where: { id } });
		user.status = status;
		await user.save();

		return user;
	}

	async findAllApproved(options: any, roles: any): Promise<IListUserDTO> {
		const { limit, page, name, email, parentId } = options;

		const skip = (+page - 1) * +limit;

		const where: any = {
			status: In(['approved', 'active', 'overdue', 'disabled']),
		};

		if (parentId) {
			where.parentId = parentId;
		}

		if (name) {
			where.trading_name = Like(`%${name}%`);
		}

		if (email) {
			where.email = Like(`%${email}%`);
		}

		where.role = Not(In(roles));

		const whereFind: any = {
			skip,
			take: limit,
			where,
			relations: ['account_configuration'],
			order: {
				created: 'DESC',
			},
		};

		const users = await this.userClient.find(whereFind);
		const totalRows = await this.userClient.count(whereFind);
		return { users, totalRows };
	}

	async totalConsultants(userId: string): Promise<number> {
		const users = await this.userClient.count({ parent: <any>userId });

		return users;
	}
}
