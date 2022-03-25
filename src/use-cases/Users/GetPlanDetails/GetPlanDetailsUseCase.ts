import { autoInjectable, inject } from 'tsyringe';

import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IGetPlanDetailsDTO } from './GetPlanDetailsDTO';

@autoInjectable()
export class GetPlanDetailsUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository
	) {}

	async execute(data: IGetPlanDetailsDTO): Promise<any> {
		const user = await this.userRepository.findById(data.id);

		if (!user) {
			throw Error('Not found');
		}

		const accountConfiguration = await this.accountConfigurationRepository.findByUserId(data.id);

		return accountConfiguration;
	}
}
