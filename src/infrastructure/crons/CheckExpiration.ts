// import cron from 'node-cron';
// import { autoInjectable } from 'tsyringe';

// import { CheckExpirationCron } from '@useCases/BillsToPay/CheckExpiration/CheckExpirationCron';

// @autoInjectable()
// export class CheckExpiration {
// 	constructor(private readonly checkExpirationCron: CheckExpirationCron) {}

// 	async register(): Promise<void> {
// 		cron.schedule(
// 			'0 5 * * *',
// 			async () => {
// 				await this.checkExpirationCron.handle();
// 			},
// 			{
// 				scheduled: true,
// 				timezone: 'America/Sao_Paulo',
// 			}
// 		);
// 	}
// }
