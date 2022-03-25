import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RegisterShippingCompanyUseCase } from './RegisterShippingCompanyUseCase';

@autoInjectable()
export class RegisterShippingCompanyController {
	constructor(private readonly registerShippingCompanyUseCase: RegisterShippingCompanyUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.body.userId = request.currentUser.id;
			const shippingCompany = await this.registerShippingCompanyUseCase.execute(request.body);

			return response.status(202).json({ shippingCompany });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
