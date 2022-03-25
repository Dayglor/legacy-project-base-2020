import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetCompaniesUseCase } from './GetCompaniesUseCase';

@autoInjectable()
export class GetCompaniesController {
	constructor(private readonly getcompaniesUseCase: GetCompaniesUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			req.query.userId = req.currentUser.id;
			const companies = await this.getcompaniesUseCase.execute(req.query);

			return res.json({ success: true, companies });
		} catch (error) {
			return res.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
