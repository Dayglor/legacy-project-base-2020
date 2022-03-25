import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetPreRegistersUseCase } from './GetPreRegistersUseCase';

@autoInjectable()
export class GetPreRegistersController {
	constructor(private readonly getPreRegistersUseCase: GetPreRegistersUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { limit, page } = request.query;
			const { users, totalRows } = await this.getPreRegistersUseCase.execute(request.query);
			return response.json({
				success: true,
				users,
				totalRows,
				limitPerPage: limit,
				page,
			});
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
				success: false,
			});
		}
	}
}
