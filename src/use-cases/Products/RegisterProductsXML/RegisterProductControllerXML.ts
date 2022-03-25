import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { Utils } from '@infrastructure/utils';

import { RegisterProductUseCase } from '../RegisterProduct/RegisterProductUseCase';

@autoInjectable()
export class RegisterProductXMLController {
	constructor(private readonly registerProductUseCase: RegisterProductUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const products = [];
			await Utils.forEachAsync2(request.body, async (product: any) => {
				product.userId = request.currentUser.id;
				const newProduct = await this.registerProductUseCase.execute(product);
				products.push(newProduct);
			});

			return response.status(202).json({ products });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
