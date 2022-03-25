import { autoInjectable, inject } from 'tsyringe';

import { IPermissionRepository, IVerifyPermissionDTO } from '@infrastructure/repositories/IPermissionRepository';

@autoInjectable()
export class PermissionVerification {
	constructor(@inject('IPermissionRepository') private readonly permissionRepository: IPermissionRepository) {}

	async verify(data: IVerifyPermissionDTO): Promise<boolean> {
		const { userId, entityType, entityId } = data;

		const permission = await this.permissionRepository.findByUserAndEntity({ userId, entityType, entityId });

		if (!permission) {
			return false;
		}
		return true;
	}
}
