import { Company } from '../database/entities/Company';

export interface ICompanyRepository {
	find(options?: any): Promise<Company[]>;
	findById(id: string): Promise<Company>;
	save(billCategory: Company): Promise<Company>;
}
