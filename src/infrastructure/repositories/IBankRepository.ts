import { Bank } from '../database/entities/Bank';

export interface IBankRepository {
	findAll(): Promise<Bank[]>;
	find(options?: any): Promise<Bank[]>;
	save(bank: Bank): Promise<Bank>;
}
