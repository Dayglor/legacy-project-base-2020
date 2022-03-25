import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { ImportProductUseCase } from './ImportProductUseCase';

@autoInjectable()
export class ImportProductController {
	constructor(private readonly importProductUseCase: ImportProductUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.body.userId = request.currentUser.id;
			const products = await this.importProductUseCase.execute(request.body);

			return response.status(202).json({ products });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
