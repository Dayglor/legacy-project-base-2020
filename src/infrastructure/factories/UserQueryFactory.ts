import { autoInjectable, inject } from 'tsyringe';

import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';
import { UserQuery } from '@infrastructure/database/entities/UserQuery';
import { IUserQueryRepository } from '@infrastructure/repositories/IUserQueryRepository';
import { IBuyScoreDTO } from '@useCases/Scores/BuyScores/BuyScoresDTO';

@autoInjectable()
export class UserQueryFactory {
	constructor(@inject('IUserQueryRepository') private readonly userQueryRepository: IUserQueryRepository) {}

	async setScoreFromBuyDTO(data: IBuyScoreDTO): Promise<UserQuery> {
		const userQuery = new UserQuery();

		userQuery.quantity_available = data.quantity;
		userQuery.type = data.type;
		userQuery.user = <any>data.user.id;
		userQuery.sale = <any>data.sale;

		return userQuery;
	}

	async releaseScoreFromAccountConfiguration(accountConfiguration: AccountConfiguration) {
		const userQuery = new UserQuery();
		userQuery.quantity_available = accountConfiguration.free_query;
		userQuery.type = 'free';
		userQuery.user = accountConfiguration.user;
		// userQuery.userId = accountConfiguration.user.id;

		return userQuery;
	}
}
