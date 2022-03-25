import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetPagSeguroSessionByPaymentUseCase } from './GetPagSeguroSessionByPaymentUseCase';

@autoInjectable()
export class GetPagSeguroSessionByPaymentController {
	constructor(private readonly getPagSeguroSessionByPaymentUseCase: GetPagSeguroSessionByPaymentUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { paymentId } = request.params;

			const sessionId = await this.getPagSeguroSessionByPaymentUseCase.execute(paymentId);

			return response.status(201).json({ sessionId });
		} catch (error) {
			return response.status(202).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
