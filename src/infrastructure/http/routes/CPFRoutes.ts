import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetCPFController } from '@useCases/CPF/GetCPF/GetCPFController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class CPFRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get('/get-CPF/:cpfSearch', (request, response) => {
			return container.resolve(GetCPFController).handle(request, response);
		});
	}
}
