import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RegisterActionUseCase } from './RegisterActionUseCase';

@autoInjectable()
export class RegisterActionController {
	constructor(private readonly registerActionUseCase: RegisterActionUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { name, parentId } = request.body;

			const action = await this.registerActionUseCase.execute({ name, parentId });

			return response.status(202).json({
				action,
			});
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
