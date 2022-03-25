import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { DetailsPreRegisterUseCase } from '../DetailsPreRegister/DetailsPreRegisterUseCase';
import { ReprovePreRegisterUseCase } from './ReprovePreRegisterUseCase';

@autoInjectable()
export class ReprovePreRegisterController {
	constructor(
		private readonly reprovePreRegisterUseCase: ReprovePreRegisterUseCase,
		private readonly detailsPreRegisterUseCase: DetailsPreRegisterUseCase
	) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			await this.detailsPreRegisterUseCase.execute({ userId: request.body.id });

			const user = await this.reprovePreRegisterUseCase.execute(request.body);

			return response.json({ success: true, user });
		} catch (error) {
			console.log(error);
			return response.status(202).json({ success: false, message: error.message });
		}
	}
}
