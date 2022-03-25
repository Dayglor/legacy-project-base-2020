import { Webhooks } from '@infrastructure/database/entities/Webhooks';

export interface IWebhookRepository {
	count(options: any): Promise<number>;
	// findById(id: string): Promise<Webhooks>;
	// save(webhook: any): Promise<Webhooks>;
	// findById(id: string): Promise<string>;
	save(webhook: any): Promise<Webhooks>;
	delete(id: string): Promise<any>;
}
