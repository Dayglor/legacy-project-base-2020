import { autoInjectable, inject } from 'tsyringe';

import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';

@autoInjectable()
export class DeleteRoleUseCase {
	constructor(@inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

	async execute(id: string): Promise<boolean> {
		await this.roleRepository.delete(id);

		return true;
	}
}
