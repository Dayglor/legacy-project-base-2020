import { autoInjectable, inject } from 'tsyringe';

import { Role } from '@infrastructure/database/entities/Role';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';

import { IGetRolesDTO } from './GetRolesDTO';

@autoInjectable()
export class GetRolesUseCase {
	constructor(@inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

	async execute(filter?: IGetRolesDTO): Promise<Role[]> {
		const { limit, page, name } = filter || {};

		const roles = await this.roleRepository.find({ limit, page, name });

		return roles;
	}
}
