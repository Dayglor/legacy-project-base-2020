import { UserQuery } from '@infrastructure/database/entities/UserQuery';

export interface IUserQueryRepository {
	count(options: any): Promise<number>;
	find(options: any): Promise<UserQuery[]>;
	findById(id: string): Promise<UserQuery>;
	save(userQuery: UserQuery): Promise<UserQuery>;
	delete(id: string): Promise<any>;
	deleteOldFreeQuery(options: any): Promise<any>;
}
