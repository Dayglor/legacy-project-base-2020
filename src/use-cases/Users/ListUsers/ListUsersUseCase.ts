import { autoInjectable, inject } from 'tsyringe';

import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IListUserDTO } from './ListUsersDTO';

@autoInjectable()
export class ListUsersUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IRoleRepository') private readonly roleRepository: IRoleRepository
	) {}

	async execute(data: any): Promise<IListUserDTO> {
		const roleAdmin = await this.roleRepository.findByName('Administrador');
		const roleConsultor = await this.roleRepository.findByName('Consultor');

		const roles = [roleAdmin.id, roleConsultor.id];

		const { users, totalRows } = await this.userRepository.findAllApproved(data, roles);

		return { users, totalRows };
	}
}
