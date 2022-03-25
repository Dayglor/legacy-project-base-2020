import { Request, Response } from 'express';
import { injectable } from 'tsyringe';

import { SetCategoryUseCase } from './SetCategoryUseCase';

@injectable()
export class SetCategoryController {
	constructor(private readonly setCategoryUseCase: SetCategoryUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id: userId } = request.currentUser;

			const productCategory = await this.setCategoryUseCase.execute({ ...request.body, userId });

			return response.json({ success: true, productCategory });
		} catch (error) {
			return response.status(202).json({ success: false.valueOf, message: error.messsage });
		}
	}
}
