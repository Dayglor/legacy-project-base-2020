import { format, subMonths, parseISO, addMonths } from 'date-fns';
import { autoInjectable, inject } from 'tsyringe';
import { Brackets, Connection, EntityManager, Repository } from 'typeorm';

import { Sale } from '@infrastructure/database/entities/Sale';
import { SaleType } from '@infrastructure/database/entities/SaleType';

import { ISaleRepository } from '../ISaleRepository';

@autoInjectable()
export class MysqlSaleRepository implements ISaleRepository {
	private readonly saleClient: Repository<Sale>;
	private readonly saleType: Repository<SaleType>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.saleClient = this.mysqlClient.getRepository(Sale);
		this.saleType = this.mysqlClient.getRepository(SaleType);
	}
	async find(options: any): Promise<Sale[]> {
		const {
			client,
			amount,
			date,
			nationalRegistration,
			product,
			seller,
			date1,
			date2,
			salesOfUsers,
			salesOfUsersCreated,
			saleType,
			isAdmin,
		} = options;
		let { limit, page } = options;
		limit = +limit || 10;
		page = +page || 1;
		const skip = (+page - 1) * +limit;

		let sales: any = this.saleClient
			.createQueryBuilder('sale')
			.take(limit)
			.skip(skip)
			.leftJoinAndSelect('sale.user', 'user')
			.leftJoinAndSelect('sale.client', 'client')
			.leftJoinAndSelect('sale.user_created', 'user_created')
			.withDeleted()
			.leftJoinAndSelect('sale.saleProduct', 'saleProduct')
			.withDeleted()
			.leftJoinAndSelect('saleProduct.product', 'product')
			.withDeleted()
			.leftJoinAndSelect('sale.saleCommissions', 'saleCommissions')
			.leftJoinAndSelect('sale.payments', 'payments')
			.leftJoinAndSelect('payments.payment_type', 'paymentType')
			.orderBy('sale.created', 'DESC');

		if (client) {
			// sales.leftJoinAndSelect('sale.client', `client.name LIKE "% :client %"`, { client });
			// sales.leftJoinAndSelect('sale.client', `client.name LIKE %${client}%`);
			sales = sales.andWhere(`client.trading_name LIKE "%${client}%"`);
		}

		if (saleType) {
			sales = sales.andWhere(`sale.sale_type_id = "${saleType.id}"`);
		}

		if (nationalRegistration) {
			sales = sales.andWhere(`client.national_registration LIKE "%${nationalRegistration}%"`);
		}

		if (date?.from && date?.to) {
			sales = sales.andWhere(`sale.created BETWEEN "${date.from} 00:00:00" AND "${date.to} 23:59:59"`);
		}

		if (date1 && date2 && !Number.isNaN(new Date(date1).getTime()) && !Number.isNaN(new Date(date1).getTime())) {
			sales = sales.andWhere(`sale.created BETWEEN "${date1} 00:00:00" AND "${date2} 23:59:59"`);
		}

		if (amount?.from && amount?.to) {
			sales = sales.andWhere(`sale.amount BETWEEN ${amount.from} AND ${amount.to}`);
		}

		if (product) {
			sales = sales.andWhere(`product.name LIKE "%${product}%"`);
		}

		if (seller) {
			sales = sales.andWhere(`user.trading_name LIKE "%${seller}%"`);
		}

		if (!isAdmin) {
			sales = sales.andWhere(
				new Brackets((qb: any) => {
					if (salesOfUsers?.length) {
						qb = qb.where(`sale.user_id IN ("${salesOfUsers.join('","')}")`);
					}
					if (salesOfUsersCreated?.length) {
						qb = qb.orWhere(`sale.user_created_id IN ("${salesOfUsersCreated.join('","')}")`);
					}
					return qb;
				})
			);
		}

		// console.log(sales.getQuery());

		sales = await sales.getMany();

		return sales;
	}

	async findAllByPaymentStatus(options: any): Promise<Sale[]> {
		const {
			client,
			amount,
			date,
			nationalRegistration,
			product,
			seller,
			date1,
			date2,
			saleType,
			salesOfUsers,
			salesOfUsersCreated,
			isAdmin,
			paymentStatus,
		} = options;
		let { limit, page } = options;
		limit = +limit || 10;
		page = +page || 1;
		const skip = (+page - 1) * +limit;

		let sales: any = this.saleClient
			.createQueryBuilder('sale')
			.take(limit)
			.skip(skip)
			.leftJoinAndSelect('sale.user', 'user')
			.leftJoinAndSelect('sale.client', 'client')
			.withDeleted()
			.leftJoinAndSelect('sale.saleProduct', 'saleProduct')
			.withDeleted()
			.leftJoinAndSelect('saleProduct.product', 'product')
			.withDeleted()
			.leftJoinAndSelect('sale.saleCommissions', 'saleCommissions')
			.leftJoinAndSelect('sale.payments', 'payments')
			.leftJoinAndSelect('payments.payment_type', 'paymentType')
			.orderBy('sale.created', 'DESC');

		if (paymentStatus.constructor === Array) {
			sales = sales.andWhere(`payments.status IN ("${paymentStatus.join('","')}")`);
		} else {
			sales = sales.andWhere(`payments.status = "${paymentStatus}"`);
		}

		if (client) {
			// sales.leftJoinAndSelect('sale.client', `client.name LIKE "% :client %"`, { client });
			// sales.leftJoinAndSelect('sale.client', `client.name LIKE %${client}%`);
			sales = sales.andWhere(`client.trading_name LIKE "%${client}%"`);
		}

		if (saleType) {
			sales = sales.andWhere(`sale.sale_type_id = "${saleType.id}"`);
		}

		if (nationalRegistration) {
			sales = sales.andWhere(`client.national_registration LIKE "%${nationalRegistration}%"`);
		}

		if (date?.from && date?.to) {
			sales = sales.andWhere(`sale.created BETWEEN "${date.from} 00:00:00" AND "${date.to} 23:59:59"`);
		}

		if (date1 && date2 && !Number.isNaN(new Date(date1).getTime()) && !Number.isNaN(new Date(date1).getTime())) {
			sales = sales.andWhere(`sale.created BETWEEN "${date1} 00:00:00" AND "${date2} 23:59:59"`);
		}

		if (amount?.from && amount?.to) {
			sales = sales.andWhere(`sale.amount BETWEEN ${amount.from} AND ${amount.to}`);
		}

		if (product) {
			sales = sales.andWhere(`product.name LIKE "%${product}%"`);
		}

		if (seller) {
			sales = sales.andWhere(`user.trading_name LIKE "%${seller}%"`);
		}

		if (!isAdmin) {
			sales = sales.andWhere(
				new Brackets((qb: any) => {
					if (salesOfUsers?.length) {
						qb = qb.where(`sale.user_id IN ("${salesOfUsers.join('","')}")`);
					}
					if (salesOfUsersCreated?.length) {
						qb = qb.orWhere(`sale.user_created_id IN ("${salesOfUsersCreated.join('","')}")`);
					}
					return qb;
				})
			);
		}

		sales = await sales.getMany();

		return sales;
	}

	async findSaleFromWebhook(options: any): Promise<Sale> {
		let sales: any = this.saleClient
			.createQueryBuilder('sale')
			.take(1)
			.skip(0)
			.leftJoinAndSelect('sale.saleProduct', 'saleProduct')
			.leftJoinAndSelect('sale.payments', 'payments')
			.leftJoinAndSelect('payments.payment_type', 'paymentType')
			// .limit(1)
			.orderBy('sale.created', 'DESC');

		if (options.externalPaymentId) {
			sales = sales.andWhere(`payments.external_id = "${options.externalPaymentId}"`);
		}

		if (options.saleType) {
			sales = sales.andWhere(`sale.sale_type_id = "${options.saleType.id}"`);
		}
		return sales.getOne();
	}

	async count(options: any): Promise<number> {
		const {
			client,
			amount,
			date,
			nationalRegistration,
			product,
			seller,
			date1,
			date2,
			salesOfUsers,
			isAdmin,
			saleType,
		} = options;

		let sales: any = this.saleClient
			.createQueryBuilder('sale')
			.leftJoinAndSelect('sale.user', 'user')
			.leftJoinAndSelect('sale.client', 'client')
			.withDeleted()
			.leftJoinAndSelect('sale.saleProduct', 'saleProduct')
			.withDeleted()
			.leftJoinAndSelect('saleProduct.product', 'product')
			.withDeleted()
			.leftJoinAndSelect('sale.saleCommissions', 'saleCommissions')
			.leftJoinAndSelect('sale.payments', 'payments');

		if (client) {
			sales = sales.andWhere(`client.trading_name LIKE "%${client}%"`);
		}

		if (nationalRegistration) {
			sales = sales.andWhere(`client.national_registration LIKE "%${nationalRegistration}%"`);
		}

		if (saleType) {
			sales = sales.andWhere(`sale.sale_type_id = "${saleType.id}"`);
		}

		if (date?.from && date?.to) {
			sales = sales.andWhere(`sale.created BETWEEN "${date.from} 00:00:00" AND "${date.to} 23:59:59"`);
		}

		if (date1 && date2 && !Number.isNaN(new Date(date1).getTime()) && !Number.isNaN(new Date(date1).getTime())) {
			sales = sales.andWhere(`sale.created BETWEEN "${date1} 00:00:00" AND "${date2} 23:59:59"`);
		}

		if (amount?.from && amount?.to) {
			sales = sales.andWhere(`sale.amount BETWEEN ${amount.from} AND ${amount.to}`);
		}

		if (product) {
			sales = sales.andWhere(`product.name LIKE "%${product}%"`);
		}

		if (seller) {
			sales = sales.andWhere(`user.trading_name LIKE "%${seller}%"`);
		}

		if (!isAdmin) {
			if (salesOfUsers?.length) {
				sales = sales.andWhere(`sale.user_id IN ("${salesOfUsers.join('","')}")`);
			}
		}

		sales = await sales.getCount();

		return sales;
	}

	async findById(id: string, manager?: EntityManager): Promise<Sale> {
		let client: any = this.saleClient;
		if (manager) {
			client = manager.getRepository(Sale);
		}

		// let sale: any = this.saleClient
		let sale: any = client
			.createQueryBuilder('sale')
			.where(`sale.id = "${id}"`)
			.leftJoinAndSelect('sale.client', 'client')
			.leftJoinAndSelect('client.address', 'clientAddress')
			.leftJoinAndSelect('client.contact_link', 'clientContactLink')
			.leftJoinAndSelect('clientContactLink.contact', 'contact')
			.leftJoinAndSelect('sale.sale_type', 'saleType')
			.leftJoinAndSelect('sale.saleProduct', 'saleProduct')
			.withDeleted()
			.leftJoinAndSelect('saleProduct.product', 'product')
			.leftJoinAndSelect('sale.saleCommissions', 'saleCommissions')
			.leftJoinAndSelect('saleCommissions.consultant', 'consultant')
			.leftJoinAndSelect('sale.payments', 'payments')
			.leftJoinAndSelect('payments.payment_type', 'paymentType')
			.leftJoinAndSelect('payments.payment_ticket', 'paymentTicket')
			.leftJoinAndSelect('payments.receivables', 'receivables')
			.leftJoinAndSelect('sale.delivery', 'delivery')
			.leftJoinAndSelect('delivery.address', 'deliveryAddress')
			.leftJoinAndSelect('sale.user', 'user')
			.orderBy('sale.created', 'DESC');

		// const sale = await client.findOne(
		// 	{ id },
		// 	{
		// 		relations: [
		// 			'client',
		// 			'client.address',
		// 			'client.contact_link',
		// 			'client.contact_link.contact',
		// 			'sale_type',
		// 			'saleProduct',
		// 			'saleProduct.product',
		// 			'saleCommissions',
		// 			'saleCommissions.consultant',
		// 			'payments',
		// 			'payments.payment_type',
		// 			'payments.payment_ticket',
		// 			'payments.receivables',
		// 			'delivery',
		// 			'delivery.address',
		// 			'user',
		// 		],
		// 	}
		// );

		sale = await sale.getOne();

		return sale;
	}

	async save(sale: Sale, manager?: EntityManager): Promise<Sale> {
		let client: any = manager;
		if (!client) {
			client = this.saleClient;
		}
		const newSale = await client.save(sale);

		return newSale;
	}

	async delete(id: string): Promise<boolean> {
		await this.saleClient.softDelete(id);

		return true;
	}

	async getDashboard(options: any): Promise<any> {
		const { userId, isMaster, saleType } = options;
		let { startDate, endDate } = options;

		startDate = startDate
			? format(parseISO(startDate), 'yyyy-MM-dd 00:00:00')
			: format(subMonths(new Date(), 1), 'yyyy-MM-dd 00:00:00');
		endDate = endDate ? format(parseISO(endDate), 'yyyy-MM-dd 23:59:59') : format(new Date(), 'yyyy-MM-dd 23:59:59');

		let salesAmount: any = this.saleClient
			.createQueryBuilder('sale')
			.select('SUM(sale.gross_amount)', 'totalAmount')
			.where(`sale.created BETWEEN "${startDate}" AND "${endDate}"`);

		let sales: any = await this.saleClient
			.createQueryBuilder('sale')
			.where(`sale.created BETWEEN "${startDate}" AND "${endDate}"`);
		// .groupBy('sale.id');

		if (isMaster) {
			sales.andWhere(`sale.user_id = "${userId}"`);
			salesAmount.andWhere(`sale.user_id = "${userId}"`);
			// sales;
		} else {
			sales.where(`sale.user_created_id = "${userId}"`);
			salesAmount.where(`sale.user_created_id = "${userId}"`);
		}

		if (saleType) {
			sales = sales.andWhere(`sale.sale_type_id = "${saleType.id}"`);
			salesAmount = salesAmount.andWhere(`sale.sale_type_id = "${saleType.id}"`);
		}

		salesAmount = await salesAmount.getRawOne();
		sales = await sales.getCount();

		return { salesAmount: +salesAmount.totalAmount, sales };
	}

	async getConsultantTotalSales(options: any): Promise<any> {
		const { userId, isMaster, saleType } = options;
		let { startDate, endDate } = options;

		startDate = startDate
			? format(parseISO(startDate), 'yyyy-MM-dd 00:00:00')
			: format(new Date(), 'yyyy-MM-01 00:00:00');
		endDate = endDate
			? format(parseISO(endDate), 'yyyy-MM-dd 23:59:59')
			: format(addMonths(parseISO(startDate), 1), 'yyyy-MM-01 00:00:00');

		let salesAmount: any = this.saleClient
			.createQueryBuilder('sale')
			.select('SUM(sale.gross_amount)', 'totalAmount')
			.where(`sale.created BETWEEN "${startDate}" AND "${endDate}"`);

		let sales: any = await this.saleClient
			.createQueryBuilder('sale')
			.where(`sale.created BETWEEN "${startDate}" AND "${endDate}"`);
		// .groupBy('sale.id');

		if (isMaster) {
			sales.andWhere(`sale.user_id = "${userId}"`);
			salesAmount.andWhere(`sale.user_id = "${userId}"`);
			// sales;
		} else {
			sales.where(`sale.user_created_id = "${userId}"`);
			salesAmount.where(`sale.user_created_id = "${userId}"`);
		}

		if (saleType) {
			sales = sales.andWhere(`sale.sale_type_id = "${saleType.id}"`);
			salesAmount = salesAmount.andWhere(`sale.sale_type_id = "${saleType.id}"`);
		}

		salesAmount = await salesAmount.getRawOne();
		sales = await sales.getCount();

		return { salesAmount: +salesAmount.totalAmount, sales };
	}

	async getTopSellersAnnually(data: any): Promise<any> {
		// const limit = null;
		// const skip = 0;

		const saleType = await this.saleType.find({
			where: {
				reference: '1',
			},
		});

		let { startDate, endDate } = data;
		if (!startDate || !endDate) {
			startDate = `${new Date().getFullYear()}-01-01`;
			endDate = `${new Date().getFullYear()}-12-31`;
		}

		const where = data;

		const bestSellers = await this.saleClient
			.createQueryBuilder('sale')
			.innerJoin('sale.user', 'user')
			.select([
				`sale.user_id`,
				`SUM(sale.gross_amount) as totalVendido`,
				`CONCAT(LPAD(MONTH(sale.created), 2, 0), "-" , YEAR(sale.created)) as concatDate`,
			])
			.where(`sale.sale_type_id = "${saleType[0].id}"`)
			.andWhere(`sale.created BETWEEN "${startDate}" AND "${endDate}"`)
			.groupBy([`sale.user_id`])
			.limit(5)
			.orderBy('totalVendido', 'DESC');

		const bestSales = await bestSellers.getRawMany();
		const users = bestSales.map((v) => {
			return v.user_id;
		});

		const queryBuilderSale = await this.saleClient
			.createQueryBuilder('sale')
			.leftJoinAndSelect('sale.user', 'user')
			.select([
				`sale.user_id`,
				`SUM(sale.gross_amount) as totalVendido`,
				`CONCAT(LPAD(MONTH(sale.created), 2, 0), "-" , YEAR(sale.created)) as concatDate`,
				`user.trading_name as name`,
			])
			.where(`sale.sale_type_id = "${saleType[0].id}"`)
			.andWhere(`sale.user_id IN ("${users.join('","')}")`)
			.andWhere(`sale.created BETWEEN "${startDate}" AND "${endDate}"`)
			.groupBy([`sale.user_id`, `CONCAT(LPAD(MONTH(sale.created), 2, 0), YEAR(sale.created))`])
			.orderBy('concatDate', 'ASC');
		const sales = await queryBuilderSale.getRawMany();
		const graphData = [];

		sales.map((v: any) => {
			const { name } = v;

			const foundData = Object.keys(graphData).find((key) => {
				if (graphData[key].name === name) {
					return true;
				}
				return false;
			});

			if (foundData) {
				graphData[foundData].data.push({ amount: v.totalVendido, month: v.concatDate });
			} else {
				graphData.push({
					name: v.name,
					data: [
						{
							amount: v.totalVendido,
							month: v.concatDate,
						},
					],
				});
			}
			return true;
		});

		const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

		graphData.map((graphDataValues, k) => {
			months.map((v) => {
				if (
					!graphDataValues.data.find((value) => {
						return value.month.slice(0, 2) === v;
					})
				) {
					graphData[k].data.push({
						amount: '0',
						month: v,
					});
				}
				return true;
			});

			graphData[k].data.sort((a, b) => {
				if (a.month > b.month) {
					return true;
				}
				if (b.month > a.month) {
					return -1;
				}
				return 0;
			});
			return true;
		});

		return graphData;
	}

	async getAnnualSales(data: any): Promise<any> {
		const saleType = await this.saleType.find({
			where: {
				reference: '1',
			},
		});

		let { startDate, endDate } = data;

		if (!startDate || !endDate) {
			startDate = `${new Date().getFullYear()}-01-01`;
			endDate = `${new Date().getFullYear()}-12-31`;
		}
		// const where = data;

		const queryBuilderSale = await this.saleClient
			.createQueryBuilder('sale')
			.leftJoinAndSelect('sale.user', 'user')
			.select([
				`sale.user_id`,
				`SUM(sale.gross_amount) as totalVendido`,
				`CONCAT(LPAD(MONTH(sale.created), 2, 0), "-" , YEAR(sale.created)) as concatDate`,
				`user.trading_name as name`,
			])
			.where(`sale.sale_type_id = "${saleType[0].id}"`)
			.andWhere(`sale.user_created_id IN ("${data.userIds.join('","')}")`)
			.andWhere(`sale.created BETWEEN "${startDate}" AND "${endDate}"`)
			.groupBy([`CONCAT(LPAD(MONTH(sale.created), 2, 0), YEAR(sale.created))`])
			.orderBy('concatDate', 'ASC');

		const sales = await queryBuilderSale.getRawMany();
		const graphData = [];

		sales.map((v: any) => {
			const { name } = v;

			const foundData = Object.keys(graphData).find((key) => {
				if (graphData[key].name === name) {
					return true;
				}
				return false;
			});

			if (foundData) {
				graphData[foundData].data.push({ amount: v.totalVendido, month: v.concatDate });
			} else {
				graphData.push({
					name: v.name,
					data: [
						{
							amount: v.totalVendido,
							month: v.concatDate,
						},
					],
				});
			}
			return true;
		});

		const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

		graphData.map((graphDataValues, k) => {
			months.map((v) => {
				if (
					!graphDataValues.data.find((value) => {
						return value.month.slice(0, 2) === v;
					})
				) {
					graphData[k].data.push({
						amount: '0',
						month: v,
					});
				}
				return true;
			});

			graphData[k].data.sort((a, b) => {
				if (a.month > b.month) {
					return true;
				}
				if (b.month > a.month) {
					return -1;
				}
				return 0;
			});
			return true;
		});

		return graphData;
	}

	async getSalesByConsultant(options: any): Promise<any> {
		let { startDate, endDate } = options;
		const saleType = await this.saleType.findOne({
			where: {
				reference: '1',
			},
		});
		startDate = startDate
			? format(parseISO(startDate), 'yyyy-MM-dd 00:00:00')
			: format(subMonths(new Date(), 1), 'yyyy-MM-dd 00:00:00');
		endDate = endDate ? format(parseISO(endDate), 'yyyy-MM-dd 23:59:59') : format(new Date(), 'yyyy-MM-dd 23:59:59');

		const queryBuilder = this.saleClient
			.createQueryBuilder('sale')
			.leftJoinAndSelect('sale.user', 'user')
			.select([
				`sale.user_id`,
				`COUNT(sale.id) as quantidadeVendido`,
				`SUM(sale.gross_amount) as totalVendido`,
				`user.trading_name as name`,
				`user.goal as meta`,
			])
			.where(`sale.sale_type_id = "${saleType.id}"`)
			.andWhere(`sale.created BETWEEN "${startDate}" AND "${endDate}"`)
			.groupBy(`user.id`)
			.orderBy('user.trading_name', 'ASC');

		const sales = await queryBuilder.getRawMany();

		return sales;
	}
}
