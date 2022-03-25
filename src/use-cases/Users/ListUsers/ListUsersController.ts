import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { ListUsersUseCase } from './ListUsersUseCase';

@autoInjectable()
export class ListUsersController {
	constructor(private readonly listUsers: ListUsersUseCase) {}
	async handle(req: Request, res: Response): Promise<Response> {
		try {
			const { users, totalRows } = await this.listUsers.execute(req.query);

			return res.json({ success: true, users, totalRows });
		} catch (error) {
			console.log(error);
			return res.status(202).json({ success: false, message: error.message });
		}
	}
}
