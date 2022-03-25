import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { EditPlanUseCase } from './EditPlanUseCase';

@autoInjectable()
export class EditPlanController {
	constructor(private readonly editPlanUseCase: EditPlanUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			request.body.id = id;

			const accountConfiguration = await this.editPlanUseCase.execute(request.body);

			return response.status(202).json({ success: true, accountConfiguration });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
