import { autoInjectable, inject } from 'tsyringe';

import { UserQueryHistory } from '@infrastructure/database/entities/UserQueryHistory';
import { IUserQueryHistoryRepository } from '@infrastructure/repositories/IUserQueryHistoryRepository';
import { IFindScoreDTO } from '@useCases/Scores/FindScore/FindScoreDTO';

@autoInjectable()
export class UserQueryHistoryFactory {
	constructor(
		@inject('IUserQueryHistoryRepository') private readonly userQueryRepository: IUserQueryHistoryRepository
	) {}

	async setFromConsultData(queryResult: any, data: IFindScoreDTO): Promise<UserQueryHistory> {
		const userQueryHistory = new UserQueryHistory();

		userQueryHistory.document = data.document;
		userQueryHistory.user = data.user;
		userQueryHistory.response = JSON.stringify(queryResult);

		return userQueryHistory;
	}
}
