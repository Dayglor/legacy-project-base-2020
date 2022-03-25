import { autoInjectable, inject } from 'tsyringe';

import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IGetPreRegistersDTO } from './GetPreRegistersDTO';

@autoInjectable()
export class GetPreRegistersUseCase {
	constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

	async execute(data: IGetPreRegistersDTO): Promise<any> {
		const users = await this.userRepository.find({
			name: data.name,
			email: data.email,
			limit: data.limit,
			page: data.page,
			status: 'pre-register',
			parentId: null,
		});
		const totalRows = await this.userRepository.count({ status: 'pre-register', name: data.name, email: data.email });

		return { users, totalRows };
	}
}
