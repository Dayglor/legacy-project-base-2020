import { Request, Response } from 'express';
import { injectable } from 'tsyringe';

import { SetCompanyUseCase } from './SetCompanyUseCase';

@injectable()
export class SetCompanyController {
	constructor(private readonly setCompanyUseCase: SetCompanyUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const company = await this.setCompanyUseCase.execute(request.body);

			return response.json({ success: true, company });
		} catch (error) {
			return response.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
