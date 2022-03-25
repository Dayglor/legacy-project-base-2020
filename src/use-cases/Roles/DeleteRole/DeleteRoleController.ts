import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DeleteRoleUseCase } from './DeleteRoleUseCase';

@autoInjectable()
export class DeleteRoleController {
	constructor(private readonly deleteRoleUseCase: DeleteRoleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			const result = await this.deleteRoleUseCase.execute(id);

			return response.status(202).json({ success: result });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
