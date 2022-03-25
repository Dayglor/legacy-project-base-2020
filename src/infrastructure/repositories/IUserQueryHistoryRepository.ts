import { UserQueryHistory } from '@infrastructure/database/entities/UserQueryHistory';

export interface IUserQueryHistoryRepository {
	count(options: any): Promise<number>;
	find(options: any): Promise<UserQueryHistory[]>;
	findById(id: string): Promise<UserQueryHistory>;
	save(userQuery: UserQueryHistory): Promise<UserQueryHistory>;
	delete(id: string): Promise<any>;
}
