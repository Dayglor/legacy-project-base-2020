import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetRolesUseCase } from './GetRolesUseCase';

@autoInjectable()
export class GetRolesController {
	constructor(private readonly getRolesUseCase: GetRolesUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const roles = await this.getRolesUseCase.execute(request.query);

			return response.status(202).json({ roles });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
