import { EntityManager } from 'typeorm';

import { Delivery } from '@infrastructure/database/entities/Delivery';

export interface IDeliveryRepository {
	find(options?: any): Promise<Delivery[]>;
	findById(id: string): Promise<Delivery>;
	save(delivery: Delivery, manager?: EntityManager): Promise<Delivery>;
}
