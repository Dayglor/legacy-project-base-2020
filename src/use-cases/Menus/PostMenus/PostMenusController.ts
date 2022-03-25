import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { PostMenusUseCase } from './PostMenusUseCase';

@autoInjectable()
export class PostMenusController {
	constructor(private readonly postMenusUseCase: PostMenusUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const menu = await this.postMenusUseCase.execute(request.body);
			return response.json({ success: true, menu });
		} catch (error) {
			return response.status(400).json({
				success: false,
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
