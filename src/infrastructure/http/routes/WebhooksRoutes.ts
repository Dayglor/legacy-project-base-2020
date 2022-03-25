import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { PostWebhookPagSeguroController } from '@useCases/Webhooks/pagseguro/PostWebhookPagSeguroController';
import { PostWebhookController } from '@useCases/Webhooks/Zspay/PostWebhookController';
// import { PostWebhook } from '@useCases/Webhooks/RegisterConsultant/RegisterConsultantController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class WebhooksRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.post('/webhooks/zspay', (request, response) => {
			return container.resolve(PostWebhookController).handle(request, response);
		});

		this.router.post('/webhooks/pagseguro/:email', (request, response) => {
			return container.resolve(PostWebhookPagSeguroController).handle(request, response);
		});

		// this.router.get('/webhook/pagseguro', (request, response) => {
		// 	return container.resolve(GetConsultantsController).handle(request, response);
		// });
	}
}
