import { autoInjectable, inject } from 'tsyringe';

import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';
import { User } from '@infrastructure/database/entities/User';
import { UserQuery } from '@infrastructure/database/entities/UserQuery';
import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { AccountConfigurationFactory } from '@infrastructure/factories/AccountConfigurationFactory';
import { UserQueryFactory } from '@infrastructure/factories/UserQueryFactory';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IUserQueryRepository } from '@infrastructure/repositories/IUserQueryRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IJoinTheSystemDTO } from './JoinTheSystemDTO';

@autoInjectable()
export class JoinTheSystemUserCase {
	constructor(
		@inject('IAccountConfigurationRepository') private readonly accountConfiguration: IAccountConfigurationRepository,
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IUserQueryRepository') private readonly userQueryRepository: IUserQueryRepository,
		private readonly accountConfigurationFactory: AccountConfigurationFactory,
		private readonly zspayPaymentGateway: ZspayPaymentGatewayProvider,
		private readonly userQueryFactory: UserQueryFactory
	) {}

	async execute(data: IJoinTheSystemDTO, currentUser: User): Promise<boolean> {
		const accountConfiguration = await this.accountConfiguration.findByUserId(currentUser.id);

		data.gatewayId = '1';
		data.userId = currentUser.id;
		data.planId = accountConfiguration.external_plan_id;
		// console.log(data);
		const signatureId = await this.singPlan(data);
		const accountConfigUpdate = await this.accountConfigurationFactory.setExternalSignatureId(
			accountConfiguration.id,
			signatureId
		);
		await this.accountConfiguration.save(accountConfigUpdate);
		await this.userRepository.updateStatus(currentUser.id, 'active');
		await this.releaseScoreQuery(accountConfiguration);

		return true;
	}

	private async releaseScoreQuery(accountConfiguration: AccountConfiguration): Promise<UserQuery> {
		const userQuery = await this.userQueryFactory.releaseScoreFromAccountConfiguration(accountConfiguration);

		const data = await this.userQueryRepository.save(userQuery);
		return data;
	}

	private async singPlan(data: IJoinTheSystemDTO): Promise<string> {
		const user = await this.userRepository.findById(data.userId);
		let plan;

		const dataSignUp = {
			planId: data.planId,
			user,
			card: data,
		};

		switch (data.gatewayId) {
			case '1':
				plan = await this.zspayPaymentGateway.signPlan(dataSignUp);
				break;
			default:
				throw new Error('Payment gateway not defined');
		}

		return plan;
	}
}
