// import { format } from 'date-fns';
// import { autoInjectable, inject } from 'tsyringe';

import { autoInjectable } from 'tsyringe';

import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';
import { IApprovePreRegisterDTO } from '@useCases/Users/ApprovePreRegister/ApprovePreRegisterDTO';
import { IEditPlanDTO } from '@useCases/Users/EditPlan/EditPlanDTO';

@autoInjectable()
export class AccountConfigurationFactory {
	// constructor(
	// 	// @inject('AccountConfigurationRepostiory')
	// 	private readonly accountConfigurationRepository: AccountConfigurationRepository
	// );

	async makeFromAccountConfigurationDTO(data: IApprovePreRegisterDTO): Promise<AccountConfiguration> {
		const accountConfiguration = new AccountConfiguration();
		accountConfiguration.free_days = data.accountConfig.freeDays;
		accountConfiguration.setup_amount = data.accountConfig.setupAmount;
		accountConfiguration.amount = data.accountConfig.amount;
		accountConfiguration.free_invoice = data.accountConfig.freeInvoices;
		accountConfiguration.free_query = data.accountConfig.freeQuery;
		accountConfiguration.free_product_invoice = data.accountConfig.freeProductInvoice;
		accountConfiguration.private_key = data.gateway.privateKey;
		accountConfiguration.token = data.gateway.token;
		accountConfiguration.user = <any>data.accountConfig.userId;
		accountConfiguration.external_plan_id = data.accountConfig.externalPlanId;
		accountConfiguration.external_signature_id = data.accountConfig.externalSignatureId;
		accountConfiguration.payment_gateway_id = data.accountConfig.gatewayId;

		return accountConfiguration;
	}

	async setExternalSignatureId(id: string, externalId: string): Promise<AccountConfiguration> {
		const accountConfiguration = await AccountConfiguration.findOne({
			where: {
				id,
			},
		});

		accountConfiguration.external_signature_id = externalId;

		return accountConfiguration;
	}

	async makeFromEditAccountConfigurationDTO(
		data: IEditPlanDTO,
		accountConfiguration: AccountConfiguration
	): Promise<AccountConfiguration> {
		accountConfiguration.amount = data.amount;
		accountConfiguration.free_invoice = data.freeInvoice;
		accountConfiguration.free_query = data.freeQuery;
		accountConfiguration.free_product_invoice = data.freeProductInvoice;
		accountConfiguration.private_key = data.gateway.privateKey;
		accountConfiguration.token = data.gateway.token;

		return accountConfiguration;
	}
}
