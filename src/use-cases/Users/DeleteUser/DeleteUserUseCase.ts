import { autoInjectable, inject } from 'tsyringe';

import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';

import { IDeleteUserDTO } from './DeleteUserDTO';

@autoInjectable()
export class DeleteUserUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly zspayPaymentGateway: ZspayPaymentGatewayProvider
	) {}

	async execute(data: IDeleteUserDTO): Promise<void> {
		const status = 'disabled';
		const user = await this.userRepository.findById(data.id);

		if (!user) {
			throw Error('Not found');
		}

		await this.userRepository.updateStatus(data.id, status);
		const accountConfiguration = await this.accountConfigurationRepository.findByUserId(data.id);

		if (Utils.isset(() => accountConfiguration.external_signature_id)) {
			await this.zspayPaymentGateway.deleteSignature({ id: accountConfiguration.external_signature_id });
		}

		await this.userRepository.delete(data.id);
	}
}
