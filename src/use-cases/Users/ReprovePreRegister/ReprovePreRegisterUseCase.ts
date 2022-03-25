import { autoInjectable, inject } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { IMailProvider } from '@infrastructure/external-providers/mail/IMailProvider';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IReprovePreRegisterDTO } from './ReprovePreRegisterDTO';

@autoInjectable()
export class ReprovePreRegisterUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IMailProvider') private readonly mailProvider: IMailProvider
	) {}

	async execute(data: IReprovePreRegisterDTO): Promise<User> {
		const result = this.userRepository.updateStatus(data.id, 'reproved');

		if (data.sendMailToClient) {
			await this.mailProvider.sendMail({
				to: {
					email: 'dayglor@zsystems.com.br',
					name: 'Dayglor',
				},
				// from: IAddress;
				subject: 'Cadastro Reprovado',
				body: data.reason || 'Seu cadastro foi reprovado',
			});
		}

		return result;
	}
}
