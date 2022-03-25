import { autoInjectable } from 'tsyringe';

import { ProductCategory } from '@infrastructure/database/entities/ProductCategory';
import { ISetCategoriesDTO } from '@useCases/ProductCategories/SetCategories/SetCategoriesDTO';

@autoInjectable()
export class ProductCategoryFactory {
	async makeFromProductCategorytDTO(data: ISetCategoriesDTO): Promise<ProductCategory> {
		const productCategory = new ProductCategory();

		productCategory.title = data.title;
		productCategory.user = <any>data.userId;

		return productCategory;
	}
}
