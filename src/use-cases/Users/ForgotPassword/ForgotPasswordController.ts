import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

@autoInjectable()
export class ForgotPasswordController {
	constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			await this.forgotPasswordUseCase.execute(request.body);

			return response.json({
				success: true,
			});
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
