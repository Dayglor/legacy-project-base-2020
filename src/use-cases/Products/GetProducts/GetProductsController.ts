import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetProductsUseCase } from './GetProductsUseCase';

@autoInjectable()
export class GetProductsController {
	constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.query.userId = request.currentUser.id;
			// request.query.parentId = request.currentUser?.parent?.id;
			const products = await this.getProductsUseCase.execute(request.query);

			return response.status(202).json({ products });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
