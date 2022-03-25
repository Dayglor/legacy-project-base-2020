import crypto from 'crypto';
import parseISO from 'date-fns/parseISO';
import passwordGenerator from 'generate-password';
import { autoInjectable, inject } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';
import { IChangePasswordDTO } from '@useCases/Users/ChangePassword/ChangePasswordDTO';
import { IEditUserDTO } from '@useCases/Users/EditUser/EditUserDTO';
import { IForgotPasswordDTO } from '@useCases/Users/ForgotPassword/ForgotPasswordDTO';
import { IPreRegisterUserDTO } from '@useCases/Users/PreRegisterUser/PreRegisterUserDTO';

@autoInjectable()
export class UserFactory {
	constructor(@inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {}

	async makeFromPreRegisterUserDTO(data: IPreRegisterUserDTO): Promise<User> {
		const { email, nationalRegistration, tradingName, companyName, gender, birthDate, revenues, commision } = data;

		let { password } = data;

		const user = new User();

		let passwordEncrypted = null;

		if (!password) {
			password = Math.random().toString(36).slice(-8);
		}

		if (password) {
			passwordEncrypted = crypto.createHash('md5').update(`${process.env.SALT}${password}`).digest('hex');
		}

		user.email = email;
		user.password = passwordEncrypted;
		user.national_registration = nationalRegistration.replace(/\D/g, '');
		user.trading_name = tradingName;
		user.company_name = companyName;
		user.gender = gender;
		user.birth_date = parseISO(birthDate);
		user.revenues = revenues;
		user.commision = commision;

		const role = await this.roleRepository.findByName('Gerencial');

		if (!role) {
			throw new Error('Role "Gerencial" not found.');
		}

		user.role = role;

		return user;
	}

	async changePasswordFromDTO(data: IChangePasswordDTO): Promise<User> {
		const user = await User.findOne({
			where: {
				id: data.userId,
			},
		});

		if (!user) {
			throw new Error('User not found.');
		}

		if (data.password) {
			user.password = crypto.createHash('md5').update(`${process.env.SALT}${data.password}`).digest('hex');
		}

		return user;
	}

	async forgotPasswordFromDTO(data: IForgotPasswordDTO): Promise<any> {
		const user = await User.findOne({
			where: {
				email: data.email,
			},
		});

		if (!user) {
			throw Error(`E-mail inválido: ${data.email}`);
		}

		const newPassword = passwordGenerator.generate({ length: 10, numbers: true });
		user.password = crypto.createHash('md5').update(`${process.env.SALT}${newPassword}`).digest('hex');

		return { user, newPassword };
	}

	async makeFromEditUserDTO(data: IEditUserDTO, user: User): Promise<User> {
		const { email, nationalRegistration, tradingName, companyName, revenues } = data;
		user.email = email;
		user.national_registration = nationalRegistration.replace(/[^\d]/g, '');
		user.trading_name = tradingName;
		user.company_name = companyName;
		user.revenues = revenues;

		return user;
	}
}
