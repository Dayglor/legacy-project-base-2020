import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RegisterSaleUseCase } from './RegisterSaleUseCase';

@autoInjectable()
export class RegisterSaleController {
	constructor(private readonly registerSaleUseCase: RegisterSaleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const {
				products,
				client,
				deliveryAddress,
				commissions,
				payments,
				files,
				sendMailToClient,
				shipping,
				discount,
				discountType,
				reasonForDiscount,
			} = request.body;

			const sale = await this.registerSaleUseCase.execute({
				userId: request.currentUser.id,
				products: products || [],
				client: client || {},
				deliveryAddress,
				commissions: commissions || [],
				payments: payments || [],
				files: files || [],
				sendMailToClient,
				shipping,
				discount,
				discountType,
				reasonForDiscount,
			});

			return response.status(201).json({ sale });
		} catch (error) {
			console.log(error);
			return response.status(202).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
