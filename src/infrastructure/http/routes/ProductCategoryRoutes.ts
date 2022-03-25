import { Request, Response, Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetCategoriesController } from '@useCases/ProductCategories/GetCategories/GetCategoriesController';
import { SetCategoryController } from '@useCases/ProductCategories/SetCategories/SetCategoryController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class ProductCategoryRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.start();
	}

	private start() {
		this.router.post(
			'/product-category',
			this.auth.authenticate,
			this.acl.canAccessAction('register-product-category'),
			(request: Request, response: Response) => {
				return container.resolve(SetCategoryController).handle(request, response);
			}
		);

		this.router.get(
			'/product-category',
			this.auth.authenticate,
			this.acl.canAccessAction('get-product-category'),
			(request: Request, response: Response) => {
				return container.resolve(GetCategoriesController).handle(request, response);
			}
		);
	}
}
