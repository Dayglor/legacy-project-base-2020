import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { GetCNPJUseCase } from './GetCNPJUseCase';

@autoInjectable()
export class GetCNPJController {
	constructor(private readonly getCNPJUseCase: GetCNPJUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { cnpjSearch } = request.params;
			const cnpj = await this.getCNPJUseCase.execute({ cnpjSearch });
			return response.json({
				success: true,
				cnpj: cnpj.data,
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
