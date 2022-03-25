import { autoInjectable, inject } from 'tsyringe';

import { IRegisterRoleDTO } from '../../use-cases/Roles/RegisterRole/RegisterRoleDTO';
import { Role } from '../database/entities/Role';
import { IRoleRepository } from '../repositories/IRoleRepository';

@autoInjectable()
export class RoleFactory {
	constructor(@inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}
	async makeFromRegisterRoleDTO(data: IRegisterRoleDTO): Promise<Role> {
		const { parentId, name } = data;

		const role = new Role();
		role.name = name;

		if (parentId) {
			const parent = await this.roleRepository.findById(parentId);

			if (!parent) {
				throw new Error(`Role ${parentId} not found.`);
			}

			role.parent = parent;
		}

		return role;
	}
}
