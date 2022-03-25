import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DeleteUserUseCase } from './DeleteUserUseCase';

@autoInjectable()
export class DeleteUserController {
	constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			await this.deleteUserUseCase.execute({ id });

			return response.status(202).json({ message: 'User deleted' });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
