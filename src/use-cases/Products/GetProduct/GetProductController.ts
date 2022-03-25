import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetProductUseCase } from './GetProductUseCase';

@autoInjectable()
export class GetProductController {
	constructor(private readonly getProductUseCase: GetProductUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const product = await this.getProductUseCase.execute({ id });

			return response.status(202).json({ product });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
