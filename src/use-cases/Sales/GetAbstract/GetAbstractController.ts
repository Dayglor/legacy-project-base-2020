import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetAbstractUseCase } from './GetAbstractUseCase';

@autoInjectable()
export class GetAbstractController {
	constructor(private readonly getAbstractUseCase: GetAbstractUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.query.currentUser = <any>request.currentUser;
			const { total, totalApproved, totalCanceled, totalPending, totalSold } = await this.getAbstractUseCase.execute(
				request.query
			);

			return response.status(202).json({ total, totalApproved, totalCanceled, totalPending, totalSold });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
