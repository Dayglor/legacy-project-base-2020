import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetBanksUseCase } from './GetBanksUseCase';

@autoInjectable()
export class GetBanksController {
	constructor(private readonly getBanksUseCase: GetBanksUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			const banks = await this.getBanksUseCase.execute(req.query);

			return res.json({ success: true, banks });
		} catch (error) {
			return res.status(400).json({
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
