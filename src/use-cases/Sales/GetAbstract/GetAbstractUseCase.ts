import { autoInjectable, inject } from 'tsyringe';

// import { Sale } from '@infrastructure/database/entities/Sale';
import { ISaleRepository } from '@infrastructure/repositories/ISaleRepository';
import { ISaleTypeRepository } from '@infrastructure/repositories/ISaleTypeRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { IGetAbstractDTO } from './GetAbstractDTO';

interface IResultGetSales {
	total: number;
	totalApproved: string;
	totalCanceled: string;
	totalPending: string;
	totalSold: number;
}

@autoInjectable()
export class GetAbstractUseCase {
	constructor(
		@inject('ISaleRepository') private readonly saleRepository: ISaleRepository,
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('ISaleTypeRepository') private readonly saleTypeRepository: ISaleTypeRepository
	) {}

	async execute(filters?: IGetAbstractDTO): Promise<IResultGetSales> {
		const { client, amount, date, nationalRegistration, product, seller, date1, date2, currentUser } = filters;

		const salesOfUsers = [currentUser.id];
		const salesOfUsersCreated = [currentUser.id];

		if (currentUser?.child?.length) {
			const currentChilds: any = await this.userRepository.findChild({ parentId: currentUser.id });

			currentChilds.map((v) => {
				salesOfUsers.push(v.id);
				return true;
			});
		}

		const limit = 99999999999;
		const page = 1;
		const saleType = await this.saleTypeRepository.findByReference(1);
		const approved = await this.saleRepository.findAllByPaymentStatus({
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
			saleType,
			salesOfUsers,
			salesOfUsersCreated,
			paymentStatus: 'approved',
			isAdmin: currentUser.role.id === '8faaef5fee2c4189bbae7e29cfb07c29',
		});

		// console.log(approved[0]);
		// console.log({
		// 	limit,
		// 	page,
		// 	client,
		// 	amount,
		// 	date,
		// 	date1,
		// 	date2,
		// 	nationalRegistration,
		// 	product,
		// 	saleType,
		// 	salesOfUsers,
		// 	salesOfUsersCreated,
		// 	paymentStatus: 'approved',
		// 	isAdmin: currentUser.role.id === '8faaef5fee2c4189bbae7e29cfb07c29',
		// });

		const totalApproved = approved.reduce((accumullator, value) => {
			return (
				value.payments.reduce((acc, value) => {
					if (value.status !== 'approved') {
						return acc;
					}
					return +value.amount + acc;
				}, 0) + accumullator
			);
		}, 0);

		const canceled = await this.saleRepository.findAllByPaymentStatus({
			limit,
			page,
			client,
			amount,
			date,
			saleType,
			date1,
			date2,
			nationalRegistration,
			product,
			seller,
			salesOfUsers,
			salesOfUsersCreated,
			paymentStatus: ['canceled', 'repproved'],
			isAdmin: currentUser.role.id === '8faaef5fee2c4189bbae7e29cfb07c29',
		});

		const totalCanceled = canceled.reduce((accumullator, value) => {
			return (
				value.payments.reduce((acc, value) => {
					if (!['canceled', 'repproved'].includes(value.status)) {
						return acc;
					}

					return value.amount + acc;
				}, 0) + accumullator
			);
		}, 0);

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

		const totalSold = sales.reduce((acc, value) => {
			return acc + value.gross_amount;
		}, 0);

		const pending = await this.saleRepository.findAllByPaymentStatus({
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
			paymentStatus: ['pending', 'waiting_payment'],
			// paymentStatus: 'pending',
			isAdmin: currentUser.role.id === '8faaef5fee2c4189bbae7e29cfb07c29',
		});

		const totalPending = pending.reduce((accumullator, value) => {
			return (
				value.payments.reduce((acc, value) => {
					if (value.status !== 'pending') {
						return acc;
					}

					return value.amount + acc;
				}, 0) + accumullator
			);
		}, 0);

		const salesTotal = await this.saleRepository.count({
			client,
			amount,
			date,
			nationalRegistration,
			saleType,
			product,
			seller,
			date1,
			date2,
			salesOfUsers,
			isAdmin: currentUser.role.id === '8faaef5fee2c4189bbae7e29cfb07c29',
		});

		return { total: salesTotal, totalApproved, totalCanceled, totalPending, totalSold };
	}
}
