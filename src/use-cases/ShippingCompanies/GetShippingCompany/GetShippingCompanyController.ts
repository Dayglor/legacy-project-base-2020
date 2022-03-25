import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetShippingCompanyUseCase } from './GetShippingCompanyUseCase';

@autoInjectable()
export class GetShippingCompanyController {
	constructor(private readonly getShippingCompanyUseCase: GetShippingCompanyUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const shippingCompany = await this.getShippingCompanyUseCase.execute({ id });

			return response.status(202).json({ success: true, shippingCompany });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
