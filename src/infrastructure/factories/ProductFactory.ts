import _ from 'lodash';
import { autoInjectable, inject } from 'tsyringe';
import { EntityManager } from 'typeorm';

import { Product } from '@infrastructure/database/entities/Product';
import { IProductRepository } from '@infrastructure/repositories/IProductRepository';
import { Utils } from '@infrastructure/utils';
import { IEditProductDTO } from '@useCases/Products/EditProduct/EditProductDTO';
import { IRegisterProductDTO } from '@useCases/Products/RegisterProduct/RegisterProductDTO';

export interface IRegisterSaleProduct {
	id: string;
	name?: string;
	quantity: number;
	note?: string;
	unitPrice?: number;
	stock?: string;
}

@autoInjectable()
export class ProductFactory {
	constructor(@inject('IProductRepository') private readonly productRepository: IProductRepository) {}

	async makeFromRegisterProductDTO(data: IRegisterProductDTO): Promise<Product> {
		const product = new Product();
		product.name = data.name;
		product.product_code = data.productCode;
		product.sku = data.sku;
		product.cost_price = data.costPrice;
		product.sale_price = data.salePrice;
		product.stock = data.stock;
		product.stock_quantity = data.stockQuantity;
		product.ICMS_percentage = data.ICMSPercentage;
		product.ICMS_value = data.ICMSValue;
		product.IPI_percentage = data.IPIPercentage;
		product.IPI_value = data.IPIValue;
		product.PIS_percentage = data.PISPercentage;
		product.PIS_value = data.PISValue;
		product.COFINS_percentage = data.COFINSPercentage;
		product.COFINS_value = data.COFINSValue;
		product.status = 'Active';
		product.product_category = <any>data.categoryId;
		product.user = <any>data.userId;
		return product;
	}

	async makeFromImportProductXMLDTO(data: any): Promise<Product> {
		const product = new Product();

		product.name = data.prod.xProd;
		product.product_code = data.prod.cProd;
		product.sku = data.prod.cProd;
		product.cost_price = data.prod.vProd.replace('.', ',');
		product.stock = '1';
		product.stock_quantity = data.prod.qCom;
		if (Utils.isset(() => data.imposto.ICMS.ICMS00)) {
			product.ICMS_percentage = data.imposto.ICMS.ICMS00.pICMS;
			product.ICMS_value = data.imposto.ICMS.ICMS00.vICMS;
		}

		if (Utils.isset(() => data.imposto.IPI.IPITrib)) {
			product.IPI_percentage = data.imposto.IPI.IPITrib.pIPI;
			product.IPI_value = data.imposto.IPI.IPITrib.vIPI;
		}

		if (Utils.isset(() => data.imposto.PIS.PISAliq)) {
			product.PIS_percentage = data.imposto.PIS.PISAliq.pPIS;
			product.PIS_value = data.imposto.PIS.PISAliq.vPIS;
		}

		if (Utils.isset(() => data.imposto.COFINS.COFINSAliq)) {
			product.COFINS_percentage = data.imposto.COFINS.COFINSAliq.pCOFINS;
			product.COFINS_value = data.imposto.COFINS.COFINSAliq.vCOFINS;
		}

		product.status = 'Active';
		product.user = <any>data.userId;

		return product;
	}

	async makeFromEditProductDTO(data: IEditProductDTO, product: Product): Promise<Product> {
		product.name = data.name;
		product.product_code = data.productCode;
		product.sku = data.sku;
		product.cost_price = data.costPrice;
		product.sale_price = data.salePrice;
		product.stock = data.stock;
		product.stock_quantity = data.stockQuantity;
		// product.tributes = data.tributes;
		product.status = data.status;
		product.product_category = <any>data.categoryId;
		product.user = <any>data.userId;

		return product;
	}

	async makeFromRegisterSaleProductDTO(
		userId: string,
		products: IRegisterSaleProduct[],
		manager?: EntityManager
	): Promise<Product[]> {
		const productsIds = products.map((p) => p.id);

		const prods = await this.productRepository.findByIdsAndUserId(productsIds, userId);

		const diff = _.difference(
			productsIds,
			prods.map((a) => a.id)
		);

		if (diff.length > 0) {
			throw new Error(`${diff.join(', ')} product(s) not found.`);
		}

		await Utils.forEachAsync2(products, async (product: IRegisterSaleProduct) => {
			const { id, quantity } = product;
			if (!quantity) {
				throw new Error(`product ${id} - A quantidade não pode ser vazia.`);
			}

			if (product.stock) {
				await this.productRepository.removeStockById(id, quantity, manager);
			}
		});

		return prods;
	}
}
