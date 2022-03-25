import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetCNPJController } from '@useCases/CNPJ/GetCNPJ/GetCNPJController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class CNPJRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get('/get-CNPJ/:cnpjSearch', (request, response) => {
			return container.resolve(GetCNPJController).handle(request, response);
		});
	}
}
