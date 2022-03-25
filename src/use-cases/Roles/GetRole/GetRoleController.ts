import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetRoleUseCase } from './GetRoleUseCase';

@autoInjectable()
export class GetRoleController {
	constructor(private readonly getRoleUseCase: GetRoleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const role = await this.getRoleUseCase.execute(id);

			return response.status(202).json({ role });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
