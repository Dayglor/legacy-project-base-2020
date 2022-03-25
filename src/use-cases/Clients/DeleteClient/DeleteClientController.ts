import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DeleteClientUseCase } from './DeleteClientUseCase';

@autoInjectable()
export class DeleteClientController {
	constructor(private readonly deleteClientUseCase: DeleteClientUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			await this.deleteClientUseCase.execute({ id });

			return response.status(202).json({ message: 'Client deleted' });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
