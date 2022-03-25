import jwt from 'jsonwebtoken';
import { autoInjectable, inject } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';

@autoInjectable()
export class AuthenticateFromOutsideUseCase {
	constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

	async execute(data: string): Promise<User> {
		const decryptedData = Utils.decrypt(data);

		const jwtData: any = jwt.verify(decryptedData, process.env.JWT_SECRET);

		const user = await this.userRepository.findById(jwtData.id);
		if (!user) {
			throw new Error('User not found.');
		}

		return user;
	}
}
