import { autoInjectable, inject } from 'tsyringe';

import { PagSeguroPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/pagseguro/PagSeguroPaymentGatewayProvider';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IPaymentRepository } from '@infrastructure/repositories/IPaymentRepository';

@autoInjectable()
export class GetPagSeguroSessionByPaymentUseCase {
	constructor(
		@inject('IPaymentRepository')
		private readonly paymentRepository: IPaymentRepository,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly pagSeguroPaymentGatewayProvider: PagSeguroPaymentGatewayProvider
	) {}

	async execute(paymentId: string): Promise<string> {
		const payment = await this.paymentRepository.findById(paymentId);

		const userConfig = await this.accountConfigurationRepository.findByUserId(payment.sale.user.id);

		if (!userConfig?.private_key || !userConfig?.token) {
			throw new Error('Usuário não tem permissão para Link de Pagamento.');
		}

		await this.pagSeguroPaymentGatewayProvider.initialize(userConfig.private_key, userConfig.token);

		const sessionId = await this.pagSeguroPaymentGatewayProvider.getSession();

		return sessionId;
	}
}
