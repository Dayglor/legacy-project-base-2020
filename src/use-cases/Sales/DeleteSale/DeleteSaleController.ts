import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DeleteSaleUseCase } from './DeleteSaleUseCase';

@autoInjectable()
export class DeleteSaleController {
	constructor(private readonly deleteSaleUseCase: DeleteSaleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			await this.deleteSaleUseCase.execute(id);

			return response.status(202).json({});
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
