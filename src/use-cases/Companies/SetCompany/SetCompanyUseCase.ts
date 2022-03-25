import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Company } from '@infrastructure/database/entities/Company';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { CompanyFactory } from '@infrastructure/factories/CompanyFactory';
import { ICompanyRepository } from '@infrastructure/repositories/ICompanyRepository';

import { ISetCompanyDTO } from './SetCompanyDTO';

@autoInjectable()
export class SetCompanyUseCase {
	constructor(
		@inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
		private readonly companyFactory: CompanyFactory
	) {}

	async execute(data: ISetCompanyDTO): Promise<Company> {
		const company = await this.companyFactory.makeFromCompanyDTO(data);

		const errors = await validate(company);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		const newCompany = await this.companyRepository.save(company);

		return newCompany;
	}
}
