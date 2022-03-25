import { EntityManager } from 'typeorm';

import { Sale } from '@infrastructure/database/entities/Sale';

export interface ISaleRepository {
	find(options?: any): Promise<Sale[]>;
	count(options?: any): Promise<number>;
	findById(id: string, manager?: EntityManager): Promise<Sale>;
	save(sale: Sale, manager?: EntityManager): Promise<Sale>;
	delete(id: string): Promise<boolean>;
	getDashboard(options: any): Promise<any>;
	getConsultantTotalSales(options: any): Promise<any>;
	findAllByPaymentStatus(options: any): Promise<any>;
	getTopSellersAnnually(options: any): Promise<any>;
	getAnnualSales(options: any): Promise<any>;
	getSalesByConsultant(options: any): Promise<any>;
}
