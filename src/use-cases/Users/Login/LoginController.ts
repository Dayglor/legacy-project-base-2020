import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

// import { Utils } from '@infrastructure/utils';

import { ILoginDTO } from './LoginDTO';
import { LoginUseCase } from './LoginUseCase';

@autoInjectable()
export class LoginController {
	constructor(private readonly loginUseCase: LoginUseCase) {}
	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { nationalRegistration, email, password } = request.body;
			const data: ILoginDTO = { nationalRegistration, email, password };

			const token = await this.loginUseCase.execute(data);

			// const authenticateToken = Utils.encrypt(token);

			return response.status(202).json({
				success: true,
				token,
				// authenticateToken,
			});
		} catch (error) {
			return response.status(400).json({
				success: false,
				message: error.message || 'Unexpected error.',
			});
		}
	}
}
