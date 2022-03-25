import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { ChangeStatusUseCase } from './ChangeStatusUseCase';

@autoInjectable()
export class ChangeStatusController {
	constructor(private readonly changeStatusUseCase: ChangeStatusUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.body.userId = request.params.id;
			await this.changeStatusUseCase.execute(request.body);

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
