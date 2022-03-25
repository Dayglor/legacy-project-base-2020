import { User } from '@infrastructure/database/entities/User';

interface IDateRange {
	from: string;
	to: string;
}

interface IAmountRange {
	from: number;
	to: number;
}

export interface IGetAbstractDTO {
	limit?: number;
	page?: number;
	client?: string;
	date1?: string;
	date2?: string;
	nationalRegistration?: string;
	date?: IDateRange;
	product?: string;
	seller?: string;
	amount?: IAmountRange;
	currentUser: User;
}
