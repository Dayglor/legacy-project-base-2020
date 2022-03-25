import { validate } from 'class-validator';
import { readFileSync } from 'fs';
import { autoInjectable, inject } from 'tsyringe';
import xml2js from 'xml2js';

import { Product } from '@infrastructure/database/entities/Product';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { ProductFactory } from '@infrastructure/factories/ProductFactory';
import { IProductRepository } from '@infrastructure/repositories/IProductRepository';
import { Utils } from '@infrastructure/utils';

import { IImportProductDTO } from './ImportProductDTO';

@autoInjectable()
export class ImportProductUseCase {
	constructor(
		@inject('IProductRepository') private readonly productRepository: IProductRepository,
		private readonly productFactory: ProductFactory
	) {}

	async execute(data: IImportProductDTO): Promise<Product[]> {
		const file = await readFileSync(data.files.path);

		const importedProducts = await xml2js.parseStringPromise(file, { explicitArray: false });

		const products = [];

		await Utils.forEachAsync2(importedProducts.nfeProc.NFe.infNFe.det, async (productXML: any) => {
			productXML.userId = data.userId;
			const newProduct = await this.productFactory.makeFromImportProductXMLDTO(productXML);

			const errors = await validate(newProduct);

			if (errors.length > 0) {
				throw new EnhancedError(
					'Validation error.',
					errors
						.map((e) => Object.values(e.constraints))
						.join()
						.split(',')
				);
			}

			products.push(newProduct);

			// await this.productRepository.save(newProduct);
		});

		return products;
	}
}
