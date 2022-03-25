import { autoInjectable, inject } from 'tsyringe';

import { Action } from '@infrastructure/database/entities/Action';
import { IActionRepository } from '@infrastructure/repositories/IActionRepository';

@autoInjectable()
export class GetActionsByRoleUseCase {
	constructor(@inject('IActionRepository') private readonly actionRepository: IActionRepository) {}

	async execute(roleId: string): Promise<Action[]> {
		const actions = await this.actionRepository.findByRole(roleId);

		return actions;
	}
}
