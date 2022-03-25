import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { JoinTheSystemUserCase } from './JoinTheSystemUseCase';

@autoInjectable()
export class JoinTheSystemController {
	constructor(private readonly joinTheSystemUseCase: JoinTheSystemUserCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { currentUser } = request;
			await this.joinTheSystemUseCase.execute(request.body, currentUser);

			return response.json({ success: true });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ success: false, message: error.message });
		}
	}
}
