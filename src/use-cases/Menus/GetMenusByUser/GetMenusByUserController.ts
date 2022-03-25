import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetMenusByUserUseCase } from './GetMenusByUserUseCase';

@autoInjectable()
export class GetMenusByUserController {
	constructor(private readonly getMenusByUserUseCase: GetMenusByUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const menus = await this.getMenusByUserUseCase.execute(request.currentUser.role.id);

			return response.status(200).json({ menus });
		} catch (error) {
			return response.status(404).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
