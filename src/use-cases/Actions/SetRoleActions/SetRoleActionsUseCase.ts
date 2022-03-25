import { autoInjectable, inject } from 'tsyringe';
import { Connection } from 'typeorm';

import { Role } from '@infrastructure/database/entities/Role';
import { IActionRepository } from '@infrastructure/repositories/IActionRepository';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';
import { Utils } from '@infrastructure/utils';

import { ISetRoleActionsDTO } from './SetRoleActionsDTO';

@autoInjectable()
export class SetRoleActionsUseCase {
	constructor(
		@inject('MysqlClient') private readonly mysqlClient: Connection,
		@inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
		@inject('IActionRepository') private readonly actionRepository: IActionRepository
	) {}

	async execute(data: ISetRoleActionsDTO): Promise<any> {
		const { roleId, actions } = data;

		const role = await this.roleRepository.findById(roleId);

		if (!role) {
			throw new Error('Role not found.');
		}

		await Utils.forEachAsync(actions, async (actionId) => {
			const action = await this.actionRepository.findById(actionId);

			if (!action) {
				throw new Error(`Action ${actionId} not found.`);
			}

			await this.mysqlClient.createQueryBuilder().relation(Role, 'actions').of(role.id).add(action.id);
		});
	}
}
