import dotenv from 'dotenv';
import path from 'path';

import { ServiceProvider } from '@infrastructure/service-providers';

const init = async (): Promise<void> => {
	let envFile = '../.env';
	switch (process.env.NODE_ENV) {
		case 'test':
			envFile = '../.env.test';
			break;
		case 'development':
			envFile = '../.env.dev';
			break;
		default:
			envFile = '../.env';
	}

	dotenv.config({
		path: path.join(__dirname, envFile),
	});

	const serviceProvider = new ServiceProvider();

	await serviceProvider.register();
};

export { init };
