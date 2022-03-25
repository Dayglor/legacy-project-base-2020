import { autoInjectable } from 'tsyringe';

import { Company } from '@infrastructure/database/entities/Company';
import { ISetCompanyDTO } from '@useCases/Companies/SetCompany/SetCompanyDTO';

@autoInjectable()
export class CompanyFactory {
	async makeFromCompanyDTO(data: ISetCompanyDTO): Promise<Company> {
		const company = new Company();

		company.name = data.name;

		return company;
	}
}
