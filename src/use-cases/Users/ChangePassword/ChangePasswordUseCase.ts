import { autoInjectable, inject } from 'tsyringe';

import { UserFactory } from '@infrastructure/factories/UserFactory';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IChangePasswordDTO } from './ChangePasswordDTO';

@autoInjectable()
export class ChangePasswordUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		private readonly UserFactory: UserFactory
	) {}

	async execute(data: IChangePasswordDTO): Promise<any> {
		const { password, passwordRepeat } = data;
		if (password !== passwordRepeat) {
			throw new Error('As senhas precisam ser idênticas');
		}

		const userUpdated = await this.UserFactory.changePasswordFromDTO(data);
		const user = await this.userRepository.save(userUpdated);

		return user;
	}
}
