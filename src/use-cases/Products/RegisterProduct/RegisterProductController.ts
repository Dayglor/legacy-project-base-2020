import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RegisterProductUseCase } from './RegisterProductUseCase';

@autoInjectable()
export class RegisterProductController {
	constructor(private readonly registerProductUseCase: RegisterProductUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.body.userId = request.currentUser.id;
			const product = await this.registerProductUseCase.execute(request.body);

			return response.status(202).json({ product });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
