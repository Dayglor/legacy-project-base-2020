import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DeleteProductUseCase } from './DeleteProductUseCase';

@autoInjectable()
export class DeleteProductController {
	constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			await this.deleteProductUseCase.execute({ id });

			return response.status(202).json({ message: 'Product deleted' });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
