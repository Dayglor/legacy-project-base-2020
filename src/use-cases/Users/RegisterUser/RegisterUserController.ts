import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RegisterUserUseCase } from './RegisterUserUseCase';

@autoInjectable()
export class RegisterUserController {
	constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}
	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const user = await this.registerUserUseCase.execute(request.body);

			return response.status(202).json({ user });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
