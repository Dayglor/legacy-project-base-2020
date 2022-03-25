import { autoInjectable, inject } from 'tsyringe';

import { Sale } from '@infrastructure/database/entities/Sale';
import { ISaleRepository } from '@infrastructure/repositories/ISaleRepository';
import { ISaleTypeRepository } from '@infrastructure/repositories/ISaleTypeRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IGetSalesDTO } from './GetSalesDTO';

interface IResultGetSales {
	sales: Sale[];
	count: number;
	total: number;
	page: number;
}

@autoInjectable()
export class GetSalesUseCase {
	constructor(
		@inject('ISaleRepository') private readonly saleRepository: ISaleRepository,
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('ISaleTypeRepository') private readonly saleTypeRepository: ISaleTypeRepository
	) {}

	async execute(filters?: IGetSalesDTO): Promise<IResultGetSales> {
		const { limit, page, client, amount, date, nationalRegistration, product, date1, date2, currentUser, seller } =
			filters;

		const salesOfUsers = [currentUser.id];
		const salesOfUsersCreated = [currentUser.id];

		// if (currentUser?.parent?.id) {
		// 	salesOfUsers.push(currentUser?.parent?.id);
		// 	// salesOfUsers.push(currentUser.id);
		// }

		if (currentUser?.child?.length) {
			const currentChilds: any = await this.userRepository.findChild({ parentId: currentUser.id });

			currentChilds.map((v) => {
				salesOfUsers.push(v.id);
				return true;
			});
		}

		const saleType = await this.saleTypeRepository.findByReference(1);

		const sales = await this.saleRepository.find({
			limit,
			page,
			client,
			amount,
			date,
			date1,
			date2,
			nationalRegistration,
			product,
			seller,
			salesOfUsers,
			salesOfUsersCreated,
			saleType,
			isAdmin: currentUser.role.id === '8faaef5fee2c4189bbae7e29cfb07c29',
		});

		const salesTotal = await this.saleRepository.count({
			client,
			amount,
			date,
			nationalRegistration,
			product,
			date1,
			date2,
			salesOfUsers,
			isAdmin: currentUser.role.id === '8faaef5fee2c4189bbae7e29cfb07c29',
		});

		return { sales, total: salesTotal, count: sales.length, page: +page || 1 };
	}
}
