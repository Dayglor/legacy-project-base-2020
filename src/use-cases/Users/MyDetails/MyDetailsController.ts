import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { MyDetailsUseCase } from './MyDetailsUseCase';

@autoInjectable()
export class MyDetailsController {
	constructor(private readonly myDetails: MyDetailsUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const user = await this.myDetails.execute({ userId: request.currentUser.id });

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
