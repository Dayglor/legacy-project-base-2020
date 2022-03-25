import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetClientsUseCase } from './GetClientsUseCase';

@autoInjectable()
export class GetClientsController {
	constructor(private readonly getClientsUseCase: GetClientsUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { currentUser } = request;

			if (currentUser?.role?.id !== '8faaef5fee2c4189bbae7e29cfb07c29') {
				request.query.userId = currentUser.id;

				if (currentUser?.role?.id === 'eb7ed55604534b619c66273c963b2a01') {
					request.query.parentId = currentUser.parent.id;
				}
			}

			// request.query.userId = ;
			const clients = await this.getClientsUseCase.execute(request.query);

			return response.status(202).json({ clients });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
