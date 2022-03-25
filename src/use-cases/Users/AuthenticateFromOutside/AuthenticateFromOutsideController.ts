import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { autoInjectable } from 'tsyringe';

import { AuthenticateFromOutsideUseCase } from './AutheticateFromOutsideUseCase';

@autoInjectable()
export class AuthenticateFromOutsideController {
	constructor(private readonly authenticateFromOutsideUseCase: AuthenticateFromOutsideUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { token }: any = request.query;

			const user = await this.authenticateFromOutsideUseCase.execute(token);

			return response.status(202).json({
				success: true,
				user,
				token: jwt.sign({ ...user }, process.env.JWT_SECRET),
			});
		} catch (error) {
			return response.status(400).json({
				success: false,
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
