import _ from 'lodash';
import { autoInjectable, inject } from 'tsyringe';

import { SaleCommission } from '@infrastructure/database/entities/SaleCommission';
import { User } from '@infrastructure/database/entities/User';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

interface IRegisterSaleCommissionDTO {
	userId: string;
	commissionType: number;
	commission: number;
}

@autoInjectable()
export class SaleCommissionFactory {
	constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

	async makeFromRegisterSaleCommissionDTO(data: IRegisterSaleCommissionDTO[]): Promise<SaleCommission[]> {
		const commissions = data.map((c) => {
			const commission = new SaleCommission();
			commission.type = c.commissionType;
			commission.amount = c.commission * 100;
			commission.consultant = <any>c.userId;

			return commission;
		});

		const usersIds = data.map((u) => u.userId);
		const users = await this.userRepository.findByIds(usersIds);

		const diff = _.difference(
			usersIds,
			users.map((u: User) => u.id)
		);

		if (diff.length > 0) {
			throw new Error(`${diff.join(', ')} user(s) not found.`);
		}

		return commissions;
	}

	async makeFromRegisterSaleUserCommission(userId: string, commissionValue: number): Promise<SaleCommission> {
		const commission = new SaleCommission();
		commission.type = 1;
		commission.amount = commissionValue;
		commission.consultant = <any>userId;

		return commission;
	}
}
