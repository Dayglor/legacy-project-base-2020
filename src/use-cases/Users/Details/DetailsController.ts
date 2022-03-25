import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DetailsUseCase } from './DetailsUseCase';

@autoInjectable()
export class DetailsController {
	constructor(private readonly details: DetailsUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			let userId = request.currentUser.id;

			if (id) {
				userId = id;
			}
			const user = await this.details.execute({ userId });

			return response.json({
				data: user,
				success: true,
			});
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				// data: error.data || {},
				success: false,
			});
		}
	}
}
