import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { Webhooks } from '@infrastructure/database/entities/Webhooks';

import { IWebhookRepository } from '../IWebhookRepository';

@autoInjectable()
export class MysqlWebhookRepository implements IWebhookRepository {
	private readonly webhookClient: Repository<Webhooks>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.webhookClient = this.mysqlClient.getRepository(Webhooks);
	}
	count(options: any): Promise<number> {
		return options;
	}
	// findById(id: string): Promise<string> {
	// 	return id;
	// }
	async save(webhookData: any): Promise<Webhooks> {
		const webhook = await this.webhookClient.save(webhookData);

		return webhook;
	}
	delete(id: string): Promise<string> {
		return id;
	}
}
