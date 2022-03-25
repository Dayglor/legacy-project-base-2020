import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetBirthdaysUseCase } from './GetBirthdaysUseCase';

@autoInjectable()
export class GetBirthdaysController {
	constructor(private readonly getBirthdaysUseCase: GetBirthdaysUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const userId = request.currentUser.id;

			const clients = await this.getBirthdaysUseCase.execute({ userId });

			return response.status(202).json({ clients });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
