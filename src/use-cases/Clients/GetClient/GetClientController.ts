import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetClientUseCase } from './GetClientUseCase';

@autoInjectable()
export class GetClientController {
	constructor(private readonly getClientUseCase: GetClientUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const client = await this.getClientUseCase.execute({ id });

			return response.status(202).json({ client });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
