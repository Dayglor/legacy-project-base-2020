import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetPagSeguroSessionUseCase } from './GetPagSeguroSessionUseCase';

@autoInjectable()
export class GetPagSeguroSessionController {
	constructor(private readonly getPagSeguroSessionUseCase: GetPagSeguroSessionUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { parent } = request.currentUser;
			let { id: userId } = request.currentUser;

			if (parent?.id) {
				userId = parent?.id;
			}

			const sessionId = await this.getPagSeguroSessionUseCase.execute(userId);

			return response.status(201).json({ sessionId });
		} catch (error) {
			return response.status(202).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
