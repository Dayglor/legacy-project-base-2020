import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetSaleUseCase } from './GetSaleUseCase';

@autoInjectable()
export class GetSaleController {
	constructor(private readonly getSaleUseCase: GetSaleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const sale = await this.getSaleUseCase.execute(id);

			return response.status(202).json({ sale });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
