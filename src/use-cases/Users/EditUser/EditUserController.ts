import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { EditUserUseCase } from './EditUserUseCase';

@autoInjectable()
export class EditUserController {
	constructor(private readonly editUserUseCase: EditUserUseCase) {}
	async handle(request: Request, response: Response): Promise<Response> {
		try {
			request.body.userId = request.params.id;
			const user = await this.editUserUseCase.execute(request.body);
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
