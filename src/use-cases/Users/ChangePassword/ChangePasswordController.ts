import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { ChangePasswordUseCase } from './ChangePasswordUseCase';

@autoInjectable()
export class ChangePasswordController {
	constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.body.userId = request.currentUser.id;
			await this.changePasswordUseCase.execute(request.body);

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
