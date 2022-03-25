import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetActionsController } from '@useCases/Actions/GetActions/GetActionsController';
import { RegisterActionController } from '@useCases/Actions/RegisterAction/RegisterActionController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class ActionsRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') auth: Authenticate,
		@inject('ACL') acl: ACL
	) {
		this.router.get('/actions', auth.authenticate, acl.canAccessAction('getActions'), (request, response) => {
			return container.resolve(GetActionsController).handle(request, response);
		});

		this.router.post('/actions', auth.authenticate, acl.canAccessAction('registerActions'), (request, response) => {
			return container.resolve(RegisterActionController).handle(request, response);
		});
	}
}
