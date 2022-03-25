import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import xml2js from 'xml2js';

import { PayPaymentLinkPagSeguroUseCase } from './PayPaymentLinkPagSeguroUseCase';

@autoInjectable()
export class PayPaymentLinkPagSeguroController {
	constructor(private readonly payPaymentLinkPagSeguroUseCase: PayPaymentLinkPagSeguroUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			const data = request.body;
			data.paymentId = id;

			const result = await this.payPaymentLinkPagSeguroUseCase.execute(data);

			return response.status(201).json({ result });
		} catch (error) {
			if (error?.response?.data) {
				error.data = await xml2js.parseStringPromise(error.response.data, { explicitArray: false });
				error.message = error.data?.errors?.error?.message;
				console.log(error.data);
			} else {
				console.log(error);
			}
			return response.status(202).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
