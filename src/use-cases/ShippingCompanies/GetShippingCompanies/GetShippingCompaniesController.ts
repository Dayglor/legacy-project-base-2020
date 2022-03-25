import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetShippingCompaniesUseCase } from './GetShippingCompaniesUseCase';

@autoInjectable()
export class GetShippingCompaniesController {
	constructor(private readonly getShippingCompaniesUseCase: GetShippingCompaniesUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.query.userId = request.currentUser.id;
			const shippingCompanies = await this.getShippingCompaniesUseCase.execute(request.query);

			return response.status(202).json({ shippingCompanies });
		} catch (error) {
			console.log(error);
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
