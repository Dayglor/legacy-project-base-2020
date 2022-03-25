import { container } from 'tsyringe';

// import { CheckExpiration } from '@infrastructure/crons/CheckExpiration';
// import { ReleaseMonthlyScoreQueries } from '@infrastructure/crons/ReleaseMonthlyScoreQueries';

export class CronsProvider {
	async register(): Promise<void> {
		// container.resolve(CheckExpiration).register();
		// container.resolve(ReleaseMonthlyScoreQueries).register();
	}
}
