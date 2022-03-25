import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { GetPagSeguroSessionController } from '@useCases/Payments/GetPagSeguroSession/GetPagSeguroSessionController';
import { GetPagSeguroSessionByPaymentController } from '@useCases/Payments/GetPagSeguroSessionByPayment/GetPagSeguroSessionByPaymentController';
import { GetPaymentController } from '@useCases/Payments/GetPayment/GetPaymentController';
import { GetPaymentTypesController } from '@useCases/Payments/GetPaymentTypes/GetPaymentTypesController';
import { PayPaymentLinkPagSeguroController } from '@useCases/Payments/PayPaymentLinkPagSeguro/PayPaymentLinkPagSeguroController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class PaymentsRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get(
			'/payments/pag-seguro/get-session',
			auth.authenticate,
			// acl.canAccessAction('get-product-by-id'),
			(request, response) => {
				return container.resolve(GetPagSeguroSessionController).handle(request, response);
			}
		);

		this.router.get(
			'/payments/pag-seguro/get-session-by-payment/:paymentId',
			// auth.authenticate,
			// acl.canAccessAction('get-product-by-id'),
			(request, response) => {
				return container.resolve(GetPagSeguroSessionByPaymentController).handle(request, response);
			}
		);

		this.router.get(
			'/payments/types',
			auth.authenticate,
			// acl.canAccessAction('get-product-by-id'),
			(request, response) => {
				return container.resolve(GetPaymentTypesController).handle(request, response);
			}
		);

		this.router.get(
			'/payments/:id',
			// auth.authenticate,
			// acl.canAccessAction('get-product-by-id'),
			(request, response) => {
				return container.resolve(GetPaymentController).handle(request, response);
			}
		);

		this.router.post(
			'/payments/:id/pay',
			auth.authenticate,
			// acl.canAccessAction('get-product-by-id'),
			(request, response) => {
				return container.resolve(PayPaymentLinkPagSeguroController).handle(request, response);
			}
		);
	}
}
