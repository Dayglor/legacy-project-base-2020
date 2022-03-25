import { UserBank } from '../database/entities/UserBank';

export interface IUserBankRepository {
	find(options?: any): Promise<UserBank[]>;
	findById(id: string): Promise<UserBank>;
	findByReference(reference: number): Promise<UserBank>;
	findByName(name: string): Promise<UserBank>;
	findByUserId(userId: string): Promise<UserBank>;
	save(data: UserBank): Promise<UserBank>;
}
