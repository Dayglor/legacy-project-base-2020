import { Router } from 'express';
import { autoInjectable, inject } from 'tsyringe';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class MainRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get('/ping', (request, response) => {
			return response.send('OK');
		});
	}
}
