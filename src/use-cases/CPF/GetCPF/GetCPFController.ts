import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetCPFUseCase } from './GetCPFUseCase';

@autoInjectable()
export class GetCPFController {
	constructor(private readonly getCPFUseCase: GetCPFUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { cpfSearch } = request.params;
			const cpf = await this.getCPFUseCase.execute({ cpfSearch });
			return response.json({
				success: true,
				cpf: cpf.score,
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
