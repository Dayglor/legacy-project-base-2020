import { autoInjectable, inject } from 'tsyringe';

import { Role } from '@infrastructure/database/entities/Role';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';

@autoInjectable()
export class GetRoleUseCase {
	constructor(@inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

	async execute(id: string): Promise<Role> {
		const role = await this.roleRepository.findById(id);

		return role;
	}
}
