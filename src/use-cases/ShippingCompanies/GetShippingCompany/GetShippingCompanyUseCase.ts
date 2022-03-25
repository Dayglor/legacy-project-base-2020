import { autoInjectable, inject } from 'tsyringe';

import { ShippingCompany } from '@infrastructure/database/entities/ShippingCompany';
import { IShippingCompanyRepository } from '@infrastructure/repositories/IShippingCompanyRepository';

import { IGetShippingCompanyDTO } from './GetShippingCompanyDTO';

@autoInjectable()
export class GetShippingCompanyUseCase {
	constructor(
		@inject('IShippingCompanyRepository') private readonly shippingCompanyRepository: IShippingCompanyRepository
	) {}

	async execute(data: IGetShippingCompanyDTO): Promise<ShippingCompany> {
		const shippingCompany = await this.shippingCompanyRepository.findById(data.id);
		if (!shippingCompany) {
			throw Error('Not found');
		}
		return shippingCompany;
	}
}
