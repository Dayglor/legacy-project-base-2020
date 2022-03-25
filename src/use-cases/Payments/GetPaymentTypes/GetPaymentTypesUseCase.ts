import { autoInjectable, inject } from 'tsyringe';

import { PaymentType } from '@infrastructure/database/entities/PaymentType';
import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IPaymentTypeRepository } from '@infrastructure/repositories/IPaymentTypeRepository';

@autoInjectable()
export class GetPaymentTypesUseCase {
	constructor(
		@inject('IPaymentTypeRepository') private readonly paymentTypeRepository: IPaymentTypeRepository,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly zspayPaymentGateway: ZspayPaymentGatewayProvider
	) {}

	async execute(userId: string): Promise<PaymentType[]> {
		const userConfig = await this.accountConfigurationRepository.findByUserId(userId);

		let paymentTypes = await this.paymentTypeRepository.find();

		if (!userConfig) {
			paymentTypes = paymentTypes.filter((a) => a.reference !== 4 && a.reference !== 5);
		} else {
			const ec = await this.zspayPaymentGateway.getEc(userConfig.user.zspay_id);

			if (!userConfig?.private_key || !userConfig?.token) {
				paymentTypes = paymentTypes.filter((a) => a.reference !== 5);
			}

			if (!userConfig?.user?.zspay_id || ec.ativo === 0) {
				paymentTypes = paymentTypes.filter((a) => a.reference !== 4);
			}
		}

		paymentTypes = paymentTypes.filter((a) => ![3].includes(+a.reference));

		return paymentTypes;
	}
}
