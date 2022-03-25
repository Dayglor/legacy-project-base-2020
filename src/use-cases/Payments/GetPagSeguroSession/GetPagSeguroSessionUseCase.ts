import { autoInjectable, inject } from 'tsyringe';

import { PagSeguroPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/pagseguro/PagSeguroPaymentGatewayProvider';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';

@autoInjectable()
export class GetPagSeguroSessionUseCase {
	constructor(
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly pagSeguroPaymentGatewayProvider: PagSeguroPaymentGatewayProvider
	) {}

	async execute(userId: string): Promise<string> {
		const userConfig = await this.accountConfigurationRepository.findByUserId(userId);

		if (!userConfig?.private_key || !userConfig?.token) {
			throw new Error('Usuário não tem permissão para Link de Pagamento.');
		}

		await this.pagSeguroPaymentGatewayProvider.initialize(userConfig.private_key, userConfig.token);

		const sessionId = await this.pagSeguroPaymentGatewayProvider.getSession();

		return sessionId;
	}
}
