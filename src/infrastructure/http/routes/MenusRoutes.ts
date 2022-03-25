import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetMenusController } from '@useCases/Menus/GetMenus/GetMenusController';
import { GetMenusByUserController } from '@useCases/Menus/GetMenusByUser/GetMenusByUserController';
import { PostMenusController } from '@useCases/Menus/PostMenus/PostMenusController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class MenusRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		// this.router.get('/menus', auth.authenticate, acl.canAccessAction('getRoles'), (request, response) => {
		this.router.get('/menus', (request, response) => {
			return container.resolve(GetMenusController).handle(request, response);
		});

		this.router.get('/menus-by-user', auth.authenticate, (request, response) => {
			return container.resolve(GetMenusByUserController).handle(request, response);
		});

		this.router.post('/menus', (request, response) => {
			return container.resolve(PostMenusController).handle(request, response);
		});
	}
}
