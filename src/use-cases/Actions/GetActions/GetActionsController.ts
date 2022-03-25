import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetActionsUseCase } from './GetActionsUseCase';

@autoInjectable()
export class GetActionsController {
	constructor(private readonly getActionsUseCase: GetActionsUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const actions = await this.getActionsUseCase.execute(request.query);

			return response.status(202).json({ actions });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
