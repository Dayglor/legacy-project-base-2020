import { SaleType } from '../database/entities/SaleType';

export interface ISaleTypeRepository {
	find(options?: any): Promise<SaleType[]>;
	findById(id: string): Promise<SaleType>;
	findByReference(reference: number): Promise<SaleType>;
	save(saleType: SaleType): Promise<SaleType>;
}
