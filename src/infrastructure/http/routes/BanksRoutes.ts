import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetBanksController } from '@useCases/Banks/GetBanks/GetBanksController';
// import { SetBillCategoryController } from '@useCases/BillsCategories/SetBillCategory/SetBillCategoryController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class BanksRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get(
			'/banks',
			// auth.authenticate,
			// acl.canAccessAction('get-bills-categories'),
			(request, response) => {
				return container.resolve(GetBanksController).handle(request, response);
			}
		);

		// this.router.post(
		// 	'/bills-categories',
		// 	// auth.authenticate,
		// 	// acl.canAccessAction('register-bill-category'),
		// 	(request, response) => {
		// 		return container.resolve(SetBillCategoryController).handle(request, response);
		// 	}
		// );
	}
}
