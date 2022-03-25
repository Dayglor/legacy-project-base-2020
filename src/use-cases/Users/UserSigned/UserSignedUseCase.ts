import { autoInjectable, inject } from 'tsyringe';

import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
// import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IUserSignedDTO } from './UserSignedDTO';

@autoInjectable()
export class UserSignedUserCase {
	constructor(
		@inject('IAccountConfigurationRepository') private readonly accountConfiguration: IAccountConfigurationRepository
	) {}

	async execute(data: IUserSignedDTO): Promise<boolean> {
		const accountConfiguration = await this.accountConfiguration.findByUserId(data.userId);

		if (!accountConfiguration || !accountConfiguration.external_signature_id) {
			return false;
		}

		return true;
	}
}
