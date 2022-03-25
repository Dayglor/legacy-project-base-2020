import { autoInjectable, inject } from 'tsyringe';

import { IShippingCompanyRepository } from '@infrastructure/repositories/IShippingCompanyRepository';

import { IDeleteShippingCompanyDTO } from './DeleteShippingCompanyDTO';

@autoInjectable()
export class DeleteShippingCompanyUseCase {
	constructor(
		@inject('IShippingCompanyRepository') private readonly shippingCompanyRepository: IShippingCompanyRepository
	) {}

	async execute(data: IDeleteShippingCompanyDTO): Promise<void> {
		const shippingCompany = await this.shippingCompanyRepository.findById(data.id);
		if (!shippingCompany) {
			throw Error('Shipping Company not found');
		}
		await this.shippingCompanyRepository.delete(data.id);
	}
}
