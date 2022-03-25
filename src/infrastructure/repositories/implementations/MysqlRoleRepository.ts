import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository } from 'typeorm';

import { Role } from '../../database/entities/Role';
import { IRoleRepository } from '../IRoleRepository';

@autoInjectable()
export class MysqlRoleRepository implements IRoleRepository {
	private readonly roleClient: Repository<Role>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.roleClient = this.mysqlClient.getRepository(Role);
	}
	async find(options: any): Promise<Role[]> {
		const { limit, page, name } = options;
		const skip = (+page - 1) * +limit;
		const where: any = {};

		if (name) {
			where.name = Like(`%${name}%`);
		}

		const roles = await this.roleClient.find({
			skip,
			take: limit,
			where,
		});

		return roles;
	}

	async findById(id: string): Promise<Role> {
		const role = await this.roleClient.findOne({ id }, { relations: ['parent'] });

		return role;
	}

	async findByName(name: string): Promise<Role> {
		const role = await this.roleClient.findOne({ name });

		return role;
	}

	async save(role: Role): Promise<Role> {
		const newRole = await this.roleClient.save(role);

		return newRole;
	}

	async delete(id: string): Promise<boolean> {
		await this.roleClient.softDelete(id);

		return true;
	}
}
