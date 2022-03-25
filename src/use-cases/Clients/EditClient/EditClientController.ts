import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { EditClientUseCase } from './EditClientUseCase';

@autoInjectable()
export class EditClientController {
	constructor(private readonly editClientUseCase: EditClientUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			request.body.id = id;

			const client = await this.editClientUseCase.execute(request.body);

			return response.status(202).json({ client });
		} catch (error) {
			console.log(error);
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
