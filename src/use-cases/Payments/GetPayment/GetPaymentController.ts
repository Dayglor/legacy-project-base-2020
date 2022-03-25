import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetPaymentUseCase } from './GetPaymentUseCase';

@autoInjectable()
export class GetPaymentController {
	constructor(private readonly getPaymentUseCase: GetPaymentUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const payment = await this.getPaymentUseCase.execute(id);

			if (!payment) {
				throw new Error('Payment not found.');
			}

			delete payment?.sale?.user?.password;

			return response.status(201).json({ payment });
		} catch (error) {
			return response.status(202).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
