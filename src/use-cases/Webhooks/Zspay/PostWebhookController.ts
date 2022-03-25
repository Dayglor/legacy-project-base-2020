import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { PostWebhookUseCase } from './PostWebhookUseCase';

@autoInjectable()
export class PostWebhookController {
	constructor(private readonly postWebhookUseCase: PostWebhookUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const webhook = await this.postWebhookUseCase.saveWebhook(request.body);
			await this.postWebhookUseCase.execute(request.body);

			return response.status(200).json({ success: true, webhook });
		} catch (error) {
			console.log(error);
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				error,
			});
		}
	}
}
