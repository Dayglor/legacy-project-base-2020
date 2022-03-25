import { NextFunction, Request, Response } from 'express';
import { autoInjectable, inject } from 'tsyringe';

import { IActionRepository } from '@infrastructure/repositories/IActionRepository';

@autoInjectable()
export class ACL {
	constructor(@inject('IActionRepository') private readonly actionRepository: IActionRepository) {}

	canAccessAction(actionName: string) {
		return async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
			try {
				const { currentUser } = request;

				if (!currentUser.role) {
					throw new Error('User Role not found.');
				}

				if (currentUser.role.name === 'Administrador') {
					return next();
				}

				await this.actionRepository.findByRoleAndAction(currentUser.role.id, actionName);

				return next();
			} catch (error) {
				return response.status(400).json({
					message: error.message || 'Unexpected error.',
				});
			}
		};
	}
}
