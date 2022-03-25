import { autoInjectable, inject } from 'tsyringe';

import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';

import { IChangeStatusDTO } from './ChangeStatusDTO';

@autoInjectable()
export class ChangeStatusUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly zspayPaymentGateway: ZspayPaymentGatewayProvider
	) {}

	async execute(data: IChangeStatusDTO): Promise<any> {
		const { userId, status } = data;
		const user = await this.userRepository.updateStatus(userId, status);

		const accountConfiguration = await this.accountConfigurationRepository.findByUserId(userId);

		if (Utils.isset(() => accountConfiguration.external_signature_id)) {
			if (status === 'active') {
				await this.zspayPaymentGateway.activateSignature({ id: accountConfiguration.external_signature_id });
			} else if (status === 'disabled') {
				await this.zspayPaymentGateway.suspendSignature({ id: accountConfiguration.external_signature_id });
			}
		}

		return user;
	}
}
