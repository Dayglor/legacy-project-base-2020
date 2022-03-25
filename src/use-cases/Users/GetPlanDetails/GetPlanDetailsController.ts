import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetPlanDetailsUseCase } from './GetPlanDetailsUseCase';

@autoInjectable()
export class GetPlanDetailsController {
	constructor(private readonly getPlanDetailsUseCase: GetPlanDetailsUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;

			const accountConfiguration = await this.getPlanDetailsUseCase.execute({ id });

			return response.status(202).json({ success: true, accountConfiguration });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
