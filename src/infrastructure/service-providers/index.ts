import path from 'path';
import { container } from 'tsyringe';

import { AWSS3Provider } from '@infrastructure/external-providers/aws/implementations/AWSS3Provider';
import { MailgunProvider } from '@infrastructure/external-providers/mail/implementations/MailgunProvider';

import { MysqlConnectionFactory } from '../database/client/MysqlConnectionFactory';
// import { MailtrapMailProvider } from '../external-providers/mail/implementations/MailtrapMailProvider';
import { AuthProvider } from './AuthProvider';
import { CronsProvider } from './CronsProvider';
import { ExportProvider } from './ExportProvider';
import { FactoriesProvider } from './FactoriesProvider';
import { RabbitMQJobsProvider } from './RabbitMQJobsProvider';
import { RepositoriesProvider } from './RepositoriesProvider';
import { RoutesProvider } from './RoutesProvider';

export class ServiceProvider {
	async register(): Promise<void> {
		console.log('Connecting to DB.');
		const mysqlClient = await MysqlConnectionFactory.make({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			type: 'mysql',
			entities: [path.resolve(path.join('src/infrastructure/database/entities/*.ts'))],
			synchronize: true, // process.env.NODE_ENV !== 'production',
			migrationsTableName: 'migrations',
			migrations: [path.resolve(path.join('src/infrastructure/database/migrations/*.ts'))],
			cli: {
				migrationsDir: path.resolve(path.join('src/infrastructure/database/migrations')),
			},
		});
		console.log('Connected to DB.');

		container.register('MysqlClient', { useValue: mysqlClient });

		container.register('IMailProvider', { useClass: MailgunProvider });

		container.register('AWS-S3', { useClass: AWSS3Provider });

		await container.resolve(ExportProvider).register();

		await container.resolve(RepositoriesProvider).register();

		await container.resolve(FactoriesProvider).register();

		await container.resolve(AuthProvider).register();
		await container.resolve(CronsProvider).register();
		await container.resolve(RoutesProvider).register();

		await container.resolve(RabbitMQJobsProvider).register();
	}
}
