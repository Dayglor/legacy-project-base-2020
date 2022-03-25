import { Permission } from '@infrastructure/database/entities/Permission';

export interface IVerifyPermissionDTO {
	userId: string;
	entityType: string;
	entityId: string;
}

export interface IPermissionRepository {
	find(options?: any): Promise<Permission[]>;
	findById(id: string): Promise<Permission>;
	save(permission: Permission): Promise<Permission>;
	findByUserAndEntity(data: IVerifyPermissionDTO): Promise<Permission>;
}
