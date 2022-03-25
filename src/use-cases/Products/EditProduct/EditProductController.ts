import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { EditProductUseCase } from './EditProductUseCase';

@autoInjectable()
export class EditProductController {
	constructor(private readonly editProductUseCase: EditProductUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			request.body.id = id;

			const product = await this.editProductUseCase.execute(request.body);

			return response.status(202).json({ product });
		} catch (error) {
			console.log(error);
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
