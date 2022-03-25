import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RegisterRoleUseCase } from './RegisterRoleUseCase';

@autoInjectable()
export class RegisterRoleController {
	constructor(private readonly registerRoleUseCase: RegisterRoleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const role = await this.registerRoleUseCase.execute(request.body);

			return response.status(202).json({ role });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
