import { EntityManager } from 'typeorm';

import { Receivable } from '../database/entities/Receivable';

export interface IReceivableRepository {
	find(options?: any): Promise<Receivable[]>;
	findById(id: string): Promise<Receivable>;
	save(receivable: Receivable, manager?: EntityManager): Promise<Receivable>;
}
