import dotenv from 'dotenv';
import path from 'path';

import { TestServiceProvider } from './TestServiceProvider';

const init = async (options?: any): Promise<void> => {
	dotenv.config({
		path: path.join(__dirname, '../../.env.test'),
	});

	const serviceProvider = new TestServiceProvider();

	await serviceProvider.register(options);
};

export { init };
