import { EntityManager } from 'typeorm';

import { SaleCommission } from '@infrastructure/database/entities/SaleCommission';

export interface ISaleCommissionRepository {
	find(options?: any): Promise<SaleCommission[]>;
	findById(id: string): Promise<SaleCommission>;
	save(saleCommission: SaleCommission, manager?: EntityManager): Promise<SaleCommission>;
}
