import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { PreRegisterUserUseCase } from './PreRegisterUserUseCase';

@autoInjectable()
export class PreRegisterUserController {
	constructor(private readonly preRegisterUserUseCase: PreRegisterUserUseCase) {}
	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const user = await this.preRegisterUserUseCase.execute(request.body);

			return response.status(200).json({ user });
		} catch (error) {
			console.log(error);
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
