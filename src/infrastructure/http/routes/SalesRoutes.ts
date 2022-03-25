import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { DeleteSaleController } from '@useCases/Sales/DeleteSale/DeleteSaleController';
import { ExportSalesController } from '@useCases/Sales/ExportSales/ExportSalesController';
import { GetAbstractController } from '@useCases/Sales/GetAbstract/GetAbstractController';
import { GetSaleController } from '@useCases/Sales/GetSale/GetSaleController';
import { GetSalesController } from '@useCases/Sales/GetSales/GetSalesController';
import { RegisterSaleController } from '@useCases/Sales/RegisterSale/RegisterSaleController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class SalesRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get('/sales', auth.authenticate, acl.canAccessAction('get-sales'), (request, response) => {
			return container.resolve(GetSalesController).handle(request, response);
		});

		this.router.get('/sales/export', auth.authenticate, acl.canAccessAction('get-sales'), (request, response) => {
			return container.resolve(ExportSalesController).handle(request, response);
		});

		this.router.post('/sales', auth.authenticate, acl.canAccessAction('register-sales'), (request, response) => {
			return container.resolve(RegisterSaleController).handle(request, response);
		});

		this.router.get('/sales/abstract', auth.authenticate, acl.canAccessAction('get-sales'), (request, response) => {
			return container.resolve(GetAbstractController).handle(request, response);
		});

		this.router.post('/sales/scores', auth.authenticate, (request, response) => {
			return container.resolve(RegisterSaleController).handle(request, response);
		});

		this.router.post('/sales/issuance-of-invoice', auth.authenticate, (request, response) => {
			return container.resolve(RegisterSaleController).handle(request, response);
		});

		this.router.delete('/sales/:id', auth.authenticate, (request, response) => {
			return container.resolve(DeleteSaleController).handle(request, response);
		});

		this.router.get('/sales/:id', auth.authenticate, acl.canAccessAction('get-sale'), (request, response) => {
			return container.resolve(GetSaleController).handle(request, response);
		});
	}
}
