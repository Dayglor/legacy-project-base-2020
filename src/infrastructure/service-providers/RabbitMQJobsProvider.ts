import { autoInjectable, container } from 'tsyringe';

import { RabbitMQClient } from '@infrastructure/external-providers/rabbit-mq/implementations/RabbitMQClient';
import { ImportHoldersFromMarketplace } from '@messagesConsumers/ImportHoldersFromMarketplace';

@autoInjectable()
export class RabbitMQJobsProvider {
	async register(): Promise<void> {
		container.register('RabbitMQClient', { useValue: new RabbitMQClient() });

		container.register('ImportHoldersFromMarketplace', { useValue: container.resolve(ImportHoldersFromMarketplace) });
	}
}
