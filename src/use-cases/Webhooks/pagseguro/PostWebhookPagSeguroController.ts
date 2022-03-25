import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { PostWebhookUseCase } from './PostWebhookUseCase';

@autoInjectable()
export class PostWebhookPagSeguroController {
	constructor(private readonly PostWebhookUseCase: PostWebhookUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			console.log(`Webhook PagSeguro`);
			const webhook = await this.PostWebhookUseCase.save(request.body, request.params);
			await this.PostWebhookUseCase.execute(request.body, request.params);
			// console.log(request.params);
			// console.log(request.query);
			// console.log(request.body);
			// console.log(request.headers);
			// console.log(request);
			return response.status(200).json({ success: true, webhook });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
