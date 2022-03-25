import { autoInjectable, inject } from 'tsyringe';

import { Company } from '@infrastructure/database/entities/Company';
import { ICompanyRepository } from '@infrastructure/repositories/ICompanyRepository';

import { IGetCompaniesDTO } from './GetCompaniesDTO';

@autoInjectable()
export class GetCompaniesUseCase {
	constructor(@inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository) {}

	async execute(data: IGetCompaniesDTO): Promise<Company[]> {
		const companies = await this.companyRepository.find(data);

		return companies;
	}
}
