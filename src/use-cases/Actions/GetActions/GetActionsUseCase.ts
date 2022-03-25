import { autoInjectable, inject } from 'tsyringe';

import { Action } from '@infrastructure/database/entities/Action';
import { IActionRepository } from '@infrastructure/repositories/IActionRepository';

import { IGetActionsDTO } from './GetActionsDTO';

@autoInjectable()
export class GetActionsUseCase {
	constructor(@inject('IActionRepository') private readonly actionRepository: IActionRepository) {}

	async execute(filter?: IGetActionsDTO): Promise<Action[]> {
		const { limit, page, name } = filter || {};

		const actions = await this.actionRepository.find({ limit, page, name });

		return actions;
	}
}
