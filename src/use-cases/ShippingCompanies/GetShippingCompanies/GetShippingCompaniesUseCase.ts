import { autoInjectable, inject } from 'tsyringe';

import { ShippingCompany } from '@infrastructure/database/entities/ShippingCompany';
import { IShippingCompanyRepository } from '@infrastructure/repositories/IShippingCompanyRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IGetShippingCompaniesDTO } from './GetShippingCompaniesDTO';

@autoInjectable()
export class GetShippingCompaniesUseCase {
	constructor(
		@inject('IShippingCompanyRepository') private readonly shippingCompanyRepository: IShippingCompanyRepository,
		@inject('IUserRepository') private readonly userRepository: IUserRepository
	) {}

	async execute(filter?: IGetShippingCompaniesDTO): Promise<ShippingCompany[]> {
		const { limit, page, searchByName } = filter || {};

		let { userId } = filter;

		const user = await this.userRepository.findById(userId);

		switch (user.role.name) {
			case 'Administrador': {
				userId = null;
				break;
			}
			case 'Consultor Master': {
				break;
			}
			default:
				userId = user.parent.id;
		}

		const shippingCompanies = await this.shippingCompanyRepository.find({
			limit,
			page,
			searchByName,
			userId,
		});

		return shippingCompanies;
	}
}
