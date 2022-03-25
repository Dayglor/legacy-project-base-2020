import { autoInjectable, inject } from 'tsyringe';

import { Webhooks } from '../database/entities/Webhooks';
import { IWebhookRepository } from '../repositories/IWebhookRepository';

@autoInjectable()
export class WebhookFactory {
	constructor(@inject('IWebhookRepository') private readonly webhookRepository: IWebhookRepository) {}
	async makeFromZspayWebhook(data: any): Promise<Webhooks> {
		const webhook = new Webhooks();
		webhook.gateway = 'zspay';
		webhook.payload = JSON.stringify(data);
		webhook.object_type = '';
		webhook.object_id = '';

		return webhook;
	}

	async makeFromPagSeguroWebhook(data: any, params): Promise<Webhooks> {
		const webhook = new Webhooks();
		webhook.gateway = 'pagseguro';
		webhook.payload = JSON.stringify(data);
		webhook.object_type = '';
		webhook.object_id = '';
		webhook.email = params.email;

		return webhook;
	}
}
