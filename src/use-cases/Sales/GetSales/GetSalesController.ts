import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetSalesUseCase } from './GetSalesUseCase';

@autoInjectable()
export class GetSalesController {
	constructor(private readonly getSalesUseCase: GetSalesUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.query.currentUser = <any>request.currentUser;
			const { sales, total, count, page } = await this.getSalesUseCase.execute(request.query);

			return response.status(202).json({ total, count, page, sales });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
