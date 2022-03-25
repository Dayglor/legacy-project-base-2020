import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { AccountConfigurationFactory } from '@infrastructure/factories/AccountConfigurationFactory';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';

import { IEditPlanDTO } from './EditPlanDTO';

@autoInjectable()
export class EditPlanUseCase {
	constructor(
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly accountConfigurationFactory: AccountConfigurationFactory,
		private readonly zspayPaymentProvider: ZspayPaymentGatewayProvider
	) {}

	async execute(data: IEditPlanDTO): Promise<any> {
		let accountConfiguration = await this.accountConfigurationRepository.findById(data.id);

		if (!accountConfiguration) {
			throw Error('Not found');
		}

		const editedAccountConfiguration = await this.accountConfigurationFactory.makeFromEditAccountConfigurationDTO(
			data,
			accountConfiguration
		);

		const errors = await validate(editedAccountConfiguration);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}

		const plan = await this.zspayPaymentProvider.getPlanDetails({ id: accountConfiguration.external_plan_id });

		plan.amount = data.amount;
		plan.id = accountConfiguration.external_plan_id;

		await this.zspayPaymentProvider.editPlan(plan);

		await this.accountConfigurationRepository.save(editedAccountConfiguration);

		accountConfiguration = await this.accountConfigurationRepository.findById(data.id);

		return accountConfiguration;
	}
}
