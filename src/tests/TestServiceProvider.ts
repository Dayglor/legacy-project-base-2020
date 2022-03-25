import path from 'path';
import { container } from 'tsyringe';

import { MysqlConnectionFactory } from '@infrastructure/database/client/MysqlConnectionFactory';
import { AWSS3Provider } from '@infrastructure/external-providers/aws/implementations/AWSS3Provider';
import { MailtrapMailProvider } from '@infrastructure/external-providers/mail/implementations/MailtrapMailProvider';
import { AuthProvider } from '@infrastructure/service-providers/AuthProvider';
import { FactoriesProvider } from '@infrastructure/service-providers/FactoriesProvider';
import { RepositoriesProvider } from '@infrastructure/service-providers/RepositoriesProvider';
import { RoutesProvider } from '@infrastructure/service-providers/RoutesProvider';

export class TestServiceProvider {
	async register(options: any): Promise<void> {
		const { synchronize } = options || {};
		const mysqlClient = await MysqlConnectionFactory.make({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			type: 'mysql',
			entities: [path.resolve(path.join('src/infrastructure/database/entities/*.ts'))],
			synchronize,
			migrationsTableName: 'migrations',
			migrations: [path.resolve(path.join('src/infrastructure/database/migrations/*.ts'))],
			cli: {
				migrationsDir: path.resolve(path.join('src/infrastructure/database/migrations')),
			},
		});

		container.register('MysqlClient', { useValue: mysqlClient });

		container.register('IMailProvider', { useClass: MailtrapMailProvider });

		container.register('AWS-S3', { useClass: AWSS3Provider });

		await container.resolve(RepositoriesProvider).register();

		await container.resolve(FactoriesProvider).register();

		await container.resolve(AuthProvider).register();
		await container.resolve(RoutesProvider).register();
	}
}
