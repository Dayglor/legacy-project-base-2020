import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetMenusUseCase } from './GetMenusUseCase';

@autoInjectable()
export class GetMenusController {
	constructor(private readonly getMenusUseCase: GetMenusUseCase) {}

	async handle(reques: Request, response: Response): Promise<Response> {
		try {
			const menus = await this.getMenusUseCase.execute();

			return response.status(200).json({ menus });
		} catch (error) {
			return response.status(404).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
