import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetCategoriesUseCase } from './GetCategoriesUseCase';

@autoInjectable()
export class GetCategoriesController {
	// constructor() {}

	constructor(private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			const { id: userId } = req.currentUser;

			const categories = await this.getCategoriesUseCase.execute({ ...req.query, userId });

			return res.json({ success: true, categories });
		} catch (error) {
			return res.status(202).json({ success: false, message: error.message });
		}
	}
}
