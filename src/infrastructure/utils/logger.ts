import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

import { AWSS3Provider } from '@infrastructure/external-providers/aws/implementations/AWSS3Provider';

const normalizeMessage = (args: any) => {
	if (!Array.isArray(args)) {
		args = [args];
	}
	return args.map((a: any) => {
		if (typeof a === 'object' && !(a instanceof Error)) {
			return JSON.stringify(a);
		}
		return a;
	});
};

const initializeLogger = (app: any): void => {
	if (process.env.NODE_ENV === 'production1') {
		const aws = new AWSS3Provider();

		winston.add(
			new WinstonCloudWatch({
				name: 'consultores',
				cloudWatchLogs: aws.CloudWatchLogs,
				logGroupName: 'consultores',
				logStreamName: 'api',
			})
		);

		console.log = (...args) => winston.info(`${normalizeMessage(args)}`);
		console.error = (...args) => winston.error(`${normalizeMessage(args)}`);
		console.warn = (...args) => winston.warn(`${normalizeMessage(args)}`);

		app.use((req: Request, res: Response, next: NextFunction) => {
			const origin = req.headers.origin || '';
			console.log(`${req.url} - ${origin}`, {
				query: req.query,
				body: req.body,
			});

			return next();
		});
	}
};

export default initializeLogger;
