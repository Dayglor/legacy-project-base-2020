import { autoInjectable, inject } from 'tsyringe';

import { UserFactory } from '@infrastructure/factories/UserFactory';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

@autoInjectable()
export class RegisterUserUseCase {
	constructor(
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		private readonly userFactory: UserFactory
	) {}
	async execute(): Promise<void> {
		// const newUser = await this.userFactory.makeFromRegisterUserDTO(data);
		// const errors = await validate(newUser);
		// if (errors.length > 0) {
		// 	throw new EnhancedError(
		// 		'Validation error.',
		// 		errors
		// 			.map((e) => Object.values(e.constraints))
		// 			.join()
		// 			.split(',')
		// 	);
		// }
		// const alreadyExists = await this.userRepository.findByEmail(newUser.email);
		// if (alreadyExists) {
		// 	throw new Error('E-mail already registered.');
		// }
		// const user = await this.userRepository.save(newUser);
		// return user;
	}
}
