import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetMenusByRoleUseCase } from './GetMenusByRoleUseCase';

@autoInjectable()
export class GetMenusByRoleController {
	constructor(private readonly getMenusByRoleUseCase: GetMenusByRoleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const menus = await this.getMenusByRoleUseCase.execute(id);

			return response.status(202).json({ menus });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
