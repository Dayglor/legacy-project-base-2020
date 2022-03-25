import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DeleteShippingCompanyUseCase } from './DeleteShippingCompanyUseCase';

@autoInjectable()
export class DeleteShippingCompanyController {
	constructor(private readonly deleteShippingCompanyUseCase: DeleteShippingCompanyUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			await this.deleteShippingCompanyUseCase.execute({ id });

			return response.status(202).json({ message: 'Shipping Company deleted' });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
