import { EntityManager } from 'typeorm';

import { User } from '@infrastructure/database/entities/User';
import { IListUserDTO } from '@useCases/Users/ListUsers/ListUsersDTO';

export interface IUserRepository {
	findByIds(usersIds: string[]);
	count(options: any): Promise<number>;
	find(options: any): Promise<User[]>;
	findChild(options?: any): Promise<User>;
	findChildren(options?: any): Promise<User[]>;
	findById(id: string): Promise<User>;
	findPreRegisterById(id: string): Promise<User>;
	findByEmail(email: string, options?: any): Promise<User>;
	findByNationalRegistration(nationalRegistration: string, options?: any): Promise<User>;
	save(user: User, manager?: EntityManager): Promise<User>;
	delete(id: string): Promise<any>;
	updateStatus(id: string, status: string): Promise<User>;
	findAllApproved(options: any, roles: any): Promise<IListUserDTO>;
	totalConsultants(userId: string): Promise<number>;
}
