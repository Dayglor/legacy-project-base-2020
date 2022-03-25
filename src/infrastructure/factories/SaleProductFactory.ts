import { autoInjectable, inject } from 'tsyringe';

import { Sale } from '@infrastructure/database/entities/Sale';
import { SaleProduct } from '@infrastructure/database/entities/SaleProduct';
import { MysqlProductRepository } from '@infrastructure/repositories/implementations/MysqlProductRepository';
import { MysqlSaleRepository } from '@infrastructure/repositories/implementations/MysqlSaleRepository';
import { IBuyScoreDTO } from '@useCases/Scores/BuyScores/BuyScoresDTO';

@autoInjectable()
export class SaleProductFactory {
	constructor(
		@inject('ISaleRepository') private readonly saleRepository: MysqlSaleRepository,
		@inject('IProductRepository') private readonly productRepository: MysqlProductRepository
	) {}

	async SaleProductFromBuyScoreDTO(data: IBuyScoreDTO): Promise<SaleProduct> {
		const saleProduct = new SaleProduct();

		const product = await this.productRepository.findById(data.productId);
		if (!product) {
			throw new Error('Product Score not found.');
		}

		saleProduct.sale = data.sale;
		saleProduct.product = product;
		saleProduct.quantity = data.quantity;
		saleProduct.amount = data.amount;
		// sale.gross_amount = `${saleDTO.grossAmount * 100}`;
		// sale.net_value = `${saleDTO.netValue}`;

		return saleProduct;
	}

	async saleProductFromWebhookInvoice(sale: Sale): Promise<SaleProduct> {
		const saleProduct = new SaleProduct();

		const product = await this.productRepository.findById('eea1551a7a27430b8e3d0972eb3bc12a');

		saleProduct.sale = sale;
		saleProduct.product = product;
		saleProduct.quantity = 1;
		saleProduct.amount = `${sale.amount}`;

		return saleProduct;
	}
}
