import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { DeleteProductController } from '@useCases/Products/DeleteProduct/DeleteProductController';
import { EditProductController } from '@useCases/Products/EditProduct/EditProductController';
import { GetProductController } from '@useCases/Products/GetProduct/GetProductController';
import { GetProductsController } from '@useCases/Products/GetProducts/GetProductsController';
import { ImportProductController } from '@useCases/Products/ImportProducts/ImportProductController';
import { RegisterProductController } from '@useCases/Products/RegisterProduct/RegisterProductController';
import { RegisterProductXMLController } from '@useCases/Products/RegisterProductsXML/RegisterProductControllerXML';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class ProductsRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get(
			'/products/:id',
			auth.authenticate,
			// acl.canAccessAction('get-product-by-id'),
			(request, response) => {
				return container.resolve(GetProductController).handle(request, response);
			}
		);

		this.router.put(
			'/products/:id',
			auth.authenticate,
			// acl.canAccessAction('edit-product-by-id'),
			(request, response) => {
				return container.resolve(EditProductController).handle(request, response);
			}
		);

		this.router.get(
			'/products',
			auth.authenticate,
			// acl.canAccessAction('get-products'),
			(request, response) => {
				return container.resolve(GetProductsController).handle(request, response);
			}
		);

		this.router.post(
			'/products',
			auth.authenticate,
			// acl.canAccessAction('register-product'),
			(request, response) => {
				return container.resolve(RegisterProductController).handle(request, response);
			}
		);

		this.router.post(
			'/products/import-xml',
			auth.authenticate,
			// acl.canAccessAction('import-xml'),
			(request, response) => {
				return container.resolve(ImportProductController).handle(request, response);
			}
		);

		this.router.post(
			'/products/xml',
			auth.authenticate,
			// acl.canAccessAction('register-products-xml'),
			(request, response) => {
				return container.resolve(RegisterProductXMLController).handle(request, response);
			}
		);

		this.router.delete(
			'/products/:id',
			auth.authenticate,
			// acl.canAccessAction('delete-product-by-id'),
			(request, response) => {
				return container.resolve(DeleteProductController).handle(request, response);
			}
		);
	}
}
