import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Role } from '@infrastructure/database/entities/Role';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { RoleFactory } from '@infrastructure/factories/RoleFactory';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';

import { IRegisterRoleDTO } from './RegisterRoleDTO';

@autoInjectable()
export class RegisterRoleUseCase {
	constructor(
		@inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
		private readonly roleFactory: RoleFactory
	) {}

	async execute(data: IRegisterRoleDTO): Promise<Role> {
		const newRole = await this.roleFactory.makeFromRegisterRoleDTO(data);

		const errors = await validate(newRole);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		const role = await this.roleRepository.save(newRole);

		return role;
	}
}
