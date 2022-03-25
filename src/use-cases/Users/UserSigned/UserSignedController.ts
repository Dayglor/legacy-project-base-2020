import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { UserSignedUserCase } from './UserSignedUseCase';

@autoInjectable()
export class UserSignedController {
	constructor(private readonly userSignedUserCase: UserSignedUserCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const hasSigned = await this.userSignedUserCase.execute({ userId: request.currentUser.id });
			return response.json({ signed: hasSigned });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ success: false, message: error.message });
		}
	}
}
