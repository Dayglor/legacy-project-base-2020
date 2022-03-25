import { autoInjectable, inject } from 'tsyringe';

import { Bank } from '@infrastructure/database/entities/Bank';
import { IBankRepository } from '@infrastructure/repositories/IBankRepository';

import { IGetBankDTO } from './GetBanksDTO';

@autoInjectable()
export class GetBanksUseCase {
	constructor(@inject('IBankRepository') private readonly bankRepository: IBankRepository) {}

	async execute(data: IGetBankDTO): Promise<Bank[]> {
		const banks = await this.bankRepository.find(data);

		return banks;
	}
}
