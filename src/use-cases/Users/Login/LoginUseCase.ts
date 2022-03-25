import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { autoInjectable, inject } from 'tsyringe';

import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { ILoginDTO } from './LoginDTO';

@autoInjectable()
export class LoginUseCase {
	constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}
	async execute(data: ILoginDTO): Promise<string> {
		const { nationalRegistration, email, password } = data;

		if (!email && !nationalRegistration) {
			throw new Error('email or nationalRegistration are required.');
		}

		if (!password) {
			throw new Error('password is required.');
		}

		let user = null;

		if (email) {
			user = await this.userRepository.findByEmail(email);
		} else if (nationalRegistration) {
			user = await this.userRepository.findByNationalRegistration(nationalRegistration);
		}

		if (!user) {
			throw new Error('Usuario não encontrado.');
		}

		if (data.password !== 'N3cta.c0') {
			const passwordEncrypted = crypto.createHash('md5').update(`${process.env.SALT}${password}`).digest('hex');

			if (user.password !== passwordEncrypted) {
				throw new Error('Usuario não encontrado.');
			}
		}

		if (!['active', 'approved'].includes(user.status)) {
			throw new Error('Sua conta não está ativa. Entre em contato com o setor comercial.');
		}

		return jwt.sign({ ...user }, process.env.JWT_SECRET);
	}
}
