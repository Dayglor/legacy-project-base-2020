import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RegisterClientUseCase } from './RegisterClientUseCase';

@autoInjectable()
export class RegisterClientController {
	constructor(private readonly registerClientUseCase: RegisterClientUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.body.userId = request.currentUser.id;
			const client = await this.registerClientUseCase.execute(request.body);

			return response.status(202).json({ client });
		} catch (error) {
			console.log(error);
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
