import { autoInjectable, inject } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { IUserBankRepository } from '@infrastructure/repositories/IUserBankRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IDetailsPreRegisterDTO } from './DetailsPreRegisterDTO';

@autoInjectable()
export class DetailsPreRegisterUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IUserBankRepository') private readonly userBankRepository: IUserBankRepository
	) {}

	async execute(data: IDetailsPreRegisterDTO): Promise<User> {
		const user = await this.userRepository.findPreRegisterById(data.userId);
		if (!user) {
			throw new Error('User not found');
		}

		user.user_bank = await this.userBankRepository.findByUserId(data.userId);

		return user;
	}
}
