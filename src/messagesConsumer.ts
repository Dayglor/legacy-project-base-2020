import 'reflect-metadata';
import { container } from 'tsyringe';

import { RabbitMQClient } from '@infrastructure/external-providers/rabbit-mq/implementations/RabbitMQClient';

import { init } from './bootstrap';

const messagesConsumerInit = async (): Promise<void> => {
	await init();

	const rabbitMQClient: RabbitMQClient = container.resolve('RabbitMQClient');

	await rabbitMQClient.consume([
		// 'ImportHoldersFromMarketplace', 'ImportAddressesFromHolder'
	]);
};

messagesConsumerInit();
