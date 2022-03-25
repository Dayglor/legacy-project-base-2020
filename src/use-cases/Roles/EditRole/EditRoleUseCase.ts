import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Role } from '@infrastructure/database/entities/Role';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';

import { IEditRoleDTO } from './EditRoleDTO';

@autoInjectable()
export class EditRoleUseCase {
	constructor(@inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

	async execute(data: IEditRoleDTO): Promise<Role> {
		const { id, parentId, name } = data;
		const role = await this.roleRepository.findById(id);

		if (!role) {
			throw new Error('Role not found.');
		}

		if (parentId) {
			role.parent = <any>parentId;
		}

		if (name) {
			role.name = name;
		}

		const errors = await validate(role);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		await this.roleRepository.save(role);

		return role;
	}
}
