import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DetailsPreRegisterUseCase } from './DetailsPreRegisterUseCase';

@autoInjectable()
export class DetailsPreRegisterController {
	constructor(private readonly detailsPreRegister: DetailsPreRegisterUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const user = await this.detailsPreRegister.execute({ userId: request.params.userId });

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
