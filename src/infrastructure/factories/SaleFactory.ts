import { autoInjectable, inject } from 'tsyringe';

// import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';
import { Client } from '@infrastructure/database/entities/Client';
import { Sale } from '@infrastructure/database/entities/Sale';
import { User } from '@infrastructure/database/entities/User';
// import { MysqlClientRepository } from '@infrastructure/repositories/implementations/MysqlClientRepository';
import { MysqlSaleRepository } from '@infrastructure/repositories/implementations/MysqlSaleRepository';
import { MysqlSaleTypeRepository } from '@infrastructure/repositories/implementations/MysqlSaleTypeRepository';
import { MysqlUserRepository } from '@infrastructure/repositories/implementations/MysqlUserRepository';
import { IBuyScoreDTO, ISaleDTO } from '@useCases/Scores/BuyScores/BuyScoresDTO';

@autoInjectable()
export class SaleFactory {
	constructor(
		@inject('ISaleRepository') private readonly saleRepository: MysqlSaleRepository,
		@inject('ISaleTypeRepository') private readonly saleTypeRepository: MysqlSaleTypeRepository,
		@inject('IUserRepository') private readonly userRepository: MysqlUserRepository
	) {}

	async SaleFromBuyScoreDTO(data: IBuyScoreDTO, saleDTO: ISaleDTO): Promise<Sale> {
		const saleType = await this.saleTypeRepository.findByReference(1);
		if (!saleType) {
			throw new Error('SaleType not found');
		}

		const sale = new Sale();
		sale.sale_type = saleType;
		sale.user = data.user;
		sale.client = saleDTO.client;
		// sale.gross_amount = `${saleDTO.grossAmount * 100}`;
		// sale.net_value = `${saleDTO.netValue}`;

		return sale;
	}

	async SaleFromWebhookRecurringSubscription(data: any, client: Client, admin: User, manager?: any): Promise<Sale> {
		const saleType = await this.saleTypeRepository.findByReference(2);
		if (!saleType) {
			throw new Error('SaleType not found');
		}

		const b = manager;
		manager = b;

		const sale = new Sale();
		sale.sale_type = saleType;
		sale.user = admin;
		sale.client = client;
		sale.gross_amount = data.amount;
		sale.amount = data.amount;
		sale.installments = 1;
		sale.notes = 'Venda cadastrada via processo de webhook ZSPAY';

		return sale;
	}
}
