import { ProductCategory } from '../database/entities/ProductCategory';

export interface IProductCategoryRepository {
	find(options?: any): Promise<ProductCategory[]>;
	findById(id: string): Promise<ProductCategory>;
	save(productCategory: ProductCategory): Promise<ProductCategory>;
	delete(id: string): Promise<void>;
}
