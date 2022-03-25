import 'reflect-metadata';

import { runCLI } from 'jest';
import { container } from 'tsyringe';

import { DatabaseStart } from './DatabaseStart';
import { init } from './testBootstrap';

let databaseStart: DatabaseStart;

async function initialize(args: any) {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [arg1, arg2, ...args3] = args;
		const testRegex = [];
		args3.forEach((a: any) => {
			testRegex.push(`\\w*(${a})\\w*(.spec.ts)`);
			testRegex.push(`\\w*(${a})\\w*\\/\\w*(.spec.ts)`);
		});
		await init({
			synchronize: true,
		});

		databaseStart = container.resolve(DatabaseStart);
		await databaseStart.initialize();

		console.log('*** Database Initialized ***');

		const { results } = await runCLI(
			{
				config: './jest.config.ts',
				watch: false,
				testRegex,
				maxWorkers: 4,
				runInBand: true,
			} as any,
			[__dirname]
		);

		return new Promise<boolean>((resolve, _reject) => {
			setTimeout(() => {
				console.log('Init finished');
				resolve(results.success);
			}, 1000);
		});
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function afterTests(success: any): Promise<void> {
	console.log('Clearing Database...');
	// await databaseStart.clearDatabase();
	console.log('Finished');
	process.exit(success ? 0 : 1);
}

initialize(process.argv)
	.then(async (success) => {
		await afterTests(success);
	})
	// tslint:disable-next-line:no-console
	.catch(async (e) => {
		console.error(e);
		await afterTests(false);
	});
