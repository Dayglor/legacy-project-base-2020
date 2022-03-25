import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { Permission } from '@infrastructure/database/entities/Permission';

import { IPermissionRepository, IVerifyPermissionDTO } from '../IPermissionRepository';

@autoInjectable()
export class MysqlPermissionRepository implements IPermissionRepository {
	private readonly permissionClient: Repository<Permission>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.permissionClient = this.mysqlClient.getRepository(Permission);
	}
	async find(options: any): Promise<Permission[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const permissions = await this.permissionClient.find({
			skip,
			take: limit,
		});

		return permissions;
	}

	async findById(id: string): Promise<Permission> {
		const permission = await this.permissionClient.findOne({ id });

		return permission;
	}

	async save(permission: Permission): Promise<Permission> {
		const newPermission = await this.permissionClient.save(permission);

		return newPermission;
	}

	async findByUserAndEntity(data: IVerifyPermissionDTO): Promise<Permission> {
		const { userId, entityId, entityType } = data;
		const permission = await this.permissionClient
			.createQueryBuilder('permission')
			.leftJoinAndSelect('permission.user', 'user', 'user.id = :userId', { userId })
			.where('permission.entityType = :entityType', { entityType })
			.andWhere('permission.entityId = :entityId', { entityId })
			.getOne();

		return permission;
	}
}
