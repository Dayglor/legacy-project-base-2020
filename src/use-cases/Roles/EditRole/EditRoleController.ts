import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { EditRoleUseCase } from './EditRoleUseCase';

@autoInjectable()
export class EditRoleController {
	constructor(private readonly editRoleUseCase: EditRoleUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			const { parentId, name } = request.body;
			const role = await this.editRoleUseCase.execute({
				id,
				parentId,
				name,
			});

			return response.status(202).json({ role });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
				data: error.data || {},
			});
		}
	}
}
