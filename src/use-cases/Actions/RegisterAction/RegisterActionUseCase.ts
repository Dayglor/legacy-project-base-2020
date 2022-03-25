import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Action } from '@infrastructure/database/entities/Action';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { IActionRepository } from '@infrastructure/repositories/IActionRepository';
import { IRegisterActionDTO } from '@useCases/Actions/RegisterAction/RegisterActionDTO';

@autoInjectable()
export class RegisterActionUseCase {
	constructor(@inject('IActionRepository') private readonly actionRepository: IActionRepository) {}

	async execute(data: IRegisterActionDTO): Promise<Action> {
		const { name, parentId } = data;

		const action = new Action();
		action.name = name;

		const errors = await validate(action);

		if (errors.length > 0) {
			throw new EnhancedError(
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
					.toString(),
				{}
			);
		}

		if (parentId) {
			const parent = await this.actionRepository.findById(parentId);

			action.parent = parent;
		}

		const newAction = await this.actionRepository.save(action);

		return newAction;
	}
}
