import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository } from 'typeorm';

import { Action } from '@infrastructure/database/entities/Action';

import { IActionRepository } from '../IActionRepository';

@autoInjectable()
export class MysqlActionRepository implements IActionRepository {
	private readonly actionClient: Repository<Action>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.actionClient = this.mysqlClient.getRepository(Action);
	}

	async save(action: Action): Promise<Action> {
		const newAction = await this.actionClient.save(action);

		return newAction;
	}

	async find(options: any): Promise<Action[]> {
		const { limit, page, name } = options;
		const skip = (+page - 1) * +limit;
		const where: any = {};

		if (name) {
			where.name = Like(`%${name}%`);
		}

		const action = await this.actionClient.find({
			skip,
			take: limit,
			where,
		});

		return action;
	}

	async findById(id: string): Promise<Action> {
		const action = await this.actionClient.findOne({ id });

		return action;
	}

	async findByName(name: string): Promise<Action> {
		const action = await this.actionClient.findOne({ name });

		return action;
	}

	async findByRole(roleId: string): Promise<Action[]> {
		const actions = await this.actionClient
			.createQueryBuilder('action')
			.leftJoinAndSelect('action.parent', 'parent')
			.leftJoinAndSelect('action.roles', 'roles', 'roles.id = :roleId', { roleId })
			.getMany();

		return actions;
	}

	async findByRoleAndAction(roleId: string, actionName: string): Promise<Action> {
		let action = await this.actionClient
			.createQueryBuilder('action')
			.leftJoinAndSelect('action.parent', 'parent')
			.leftJoinAndSelect('action.roles', 'roles', 'roles.id = :roleId', { roleId })
			.where('action.name = :actionName', { actionName })
			.getOne();

		if (!action) {
			throw new Error('Action not found.');
		}

		if (!action.roles.length) {
			if (action.parent?.id) {
				action = await this.actionClient
					.createQueryBuilder('action')
					.leftJoinAndSelect('action.parent', 'parent')
					.leftJoinAndSelect('action.roles', 'roles', 'roles.id = :roleId', { roleId })
					.where('action.name = :actionName', { actionName: action.parent.name })
					.getOne();
			}

			if (!action.roles.length) {
				throw new Error("You can't access this endpoint.");
			}
		}

		return action;
	}
}
