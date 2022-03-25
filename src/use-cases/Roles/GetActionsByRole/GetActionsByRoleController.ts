import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetActionsByRoleUseCase } from './GetActionsByRoleUseCase';

@autoInjectable()
export class GetActionsByRoleController {
	constructor(private readonly getActionsByRoleUseCase: GetActionsByRoleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const actions = await this.getActionsByRoleUseCase.execute(id);

			return response.status(202).json({ actions });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
