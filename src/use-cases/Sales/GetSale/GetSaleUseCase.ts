import { autoInjectable, inject } from 'tsyringe';

import { Sale } from '@infrastructure/database/entities/Sale';
import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { ISaleRepository } from '@infrastructure/repositories/ISaleRepository';
import { Utils } from '@infrastructure/utils';

@autoInjectable()
export class GetSaleUseCase {
	constructor(
		@inject('ISaleRepository') private readonly saleRepository: ISaleRepository,
		private readonly zspayPaymentGatewayProvider: ZspayPaymentGatewayProvider
	) {}

	async execute(id: string): Promise<Sale> {
		const sale = await this.saleRepository.findById(id);

		await Utils.forEachAsync2(sale.payments, async (p: any) => {
			if (p.payment_type.reference === 4) {
				p.externalData = await this.zspayPaymentGatewayProvider.getSignatureDetails(p.external_id);
			}
		});

		return sale;
	}
}
