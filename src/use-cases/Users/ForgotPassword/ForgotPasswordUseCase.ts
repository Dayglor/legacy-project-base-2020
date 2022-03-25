import { autoInjectable, inject } from 'tsyringe';

import { IMailProvider } from '@infrastructure/external-providers/mail/IMailProvider';
import { UserFactory } from '@infrastructure/factories/UserFactory';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IForgotPasswordDTO } from './ForgotPasswordDTO';

@autoInjectable()
export class ForgotPasswordUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IMailProvider') private readonly mailProvider: IMailProvider,
		private readonly UserFactory: UserFactory
	) {}

	async execute(data: IForgotPasswordDTO): Promise<any> {
		const userUpdated = await this.UserFactory.forgotPasswordFromDTO(data);

		await this.mailProvider.sendMail({
			to: {
				email: data.email,
				name: userUpdated.user.tranding_name,
			},
			subject: 'Recuperação de senha',
			body: `E-mail: ${data.email} /n Senha: ${userUpdated.password}`,
		});

		const user = await this.userRepository.save(userUpdated.user);

		return user;
	}
}
