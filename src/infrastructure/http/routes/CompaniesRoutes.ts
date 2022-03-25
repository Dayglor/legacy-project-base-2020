import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetCompaniesController } from '@useCases/Companies/GetCompanies/GetCompaniesController';
import { SetCompanyController } from '@useCases/Companies/SetCompany/SetCompanyController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class CompaniesRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get(
			'/companies',
			auth.authenticate,
			// acl.canAccessAction('get-companies'),
			(request, response) => {
				return container.resolve(GetCompaniesController).handle(request, response);
			}
		);

		this.router.post(
			'/companies',
			auth.authenticate,
			// acl.canAccessAction('register-company'),
			(request, response) => {
				return container.resolve(SetCompanyController).handle(request, response);
			}
		);
	}
}
