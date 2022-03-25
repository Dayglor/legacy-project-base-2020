import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';
import { User } from '@infrastructure/database/entities/User';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
// import { ICreatePlan } from '@infrastructure/external-providers/paymentGateway/IPaymentGateway';
import { IMailProvider } from '@infrastructure/external-providers/mail/IMailProvider';
import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { AccountConfigurationFactory } from '@infrastructure/factories/AccountConfigurationFactory';
import { UserFactory } from '@infrastructure/factories/UserFactory';
import { IAccountConfigurationRepository } from '@infrastructure/repositories/IAccountConfigurationRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IApprovePreRegisterDTO } from './ApprovePreRegisterDTO';

@autoInjectable()
export class ApprovePreRegisterUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IMailProvider') private readonly mailProvider: IMailProvider,
		@inject('IAccountConfigurationRepository')
		private readonly accountConfigurationRepository: IAccountConfigurationRepository,
		private readonly accountConfigurationFactory: AccountConfigurationFactory,
		private readonly zspayPaymentGateway: ZspayPaymentGatewayProvider,
		private readonly userFactory: UserFactory
	) {}

	async execute(data: IApprovePreRegisterDTO): Promise<User> {
		const user = await this.userRepository.findPreRegisterById(data.id);
		if (!user) {
			throw new Error('User not found.');
		}

		// generate plan
		data.accountConfig.gatewayId = '1';
		const planId = await this.generatePlan(data, user);
		if (!planId) {
			throw Error('Plano não foi gerado');
		}

		data.accountConfig.externalPlanId = `${planId}`;
		// generate account configuration
		data.accountConfig.userId = user.id;
		await this.generateAccountConfiguration(data);

		// change user status
		await this.userRepository.updateStatus(data.id, 'approved');

		const newPassword = Math.random().toString(36).slice(-8);
		const passwordUpdated = await this.userFactory.changePasswordFromDTO({
			password: newPassword,
			passwordRepeat: newPassword,
			userId: user.id,
		});

		await this.userRepository.save(passwordUpdated);

		const ApprovePreRegisterMailData = {
			name: user.trading_name,
			email: user.email,
			password: newPassword,
		};

		await this.mailProvider.sendApprovePreRegisterMail(ApprovePreRegisterMailData);

		return user;
	}

	private async generateAccountConfiguration(data): Promise<AccountConfiguration> {
		const newAccountSetup = await this.accountConfigurationFactory.makeFromAccountConfigurationDTO(data);
		const errors = await validate(newAccountSetup);
		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
			);
		}
		const accountConfiguration = await this.accountConfigurationRepository.save(newAccountSetup);
		return accountConfiguration;
	}

	private async generatePlan(data: IApprovePreRegisterDTO, user: User): Promise<number> {
		const dataPlan = {
			title: `${user.trading_name}-${new Date().getTime()}`,
			description: `Plano gerado automaticamente apartir do sistema dos consultores. Cliente: ${user.trading_name}`,
			amount: data.accountConfig.amount,
			setupAmount: data.accountConfig.setupAmount,
			gracePeriod: data.accountConfig.freeDays,
			frequency: 'monthly',
			interval: '1',
		};

		let planId;

		switch (data.accountConfig.gatewayId) {
			case '1':
				planId = await this.zspayPaymentGateway.createPlan(dataPlan);
				break;
			default:
				throw new Error('Payment gateway not defined');
		}

		return planId;
	}
}
