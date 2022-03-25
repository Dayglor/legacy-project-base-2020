import { User } from '@infrastructure/database/entities/User';

export interface IListUserDTO {
	users: User[];
	totalRows: number;
	name?: string;
	email?: string;
}
