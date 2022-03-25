import { autoInjectable, inject } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IDetailsDTO } from './DetailsDTO';

@autoInjectable()
export class MyDetailsUseCase {
	constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

	async execute(data: IDetailsDTO): Promise<User> {
		const user = await this.userRepository.findById(data.userId);
		if (!user) {
			throw new Error('User not found.');
		}
		return user;
	}
}
