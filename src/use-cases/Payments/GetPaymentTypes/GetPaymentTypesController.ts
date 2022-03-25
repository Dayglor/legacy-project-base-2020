import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetPaymentTypesUseCase } from './GetPaymentTypesUseCase';

@autoInjectable()
export class GetPaymentTypesController {
	constructor(private readonly getPaymentTypesUseCase: GetPaymentTypesUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { parent } = request.currentUser;
			let { id: userId } = request.currentUser;

			if (parent?.id) {
				userId = parent?.id;
			}

			const paymentTypes = await this.getPaymentTypesUseCase.execute(userId);

			return response.status(201).json({ paymentTypes });
		} catch (error) {
			return response.status(202).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
