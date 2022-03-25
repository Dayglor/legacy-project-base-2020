import { EntityManager } from 'typeorm';

import { Address } from '../database/entities/Address';

export interface IAddressRepository {
	find(options?: any): Promise<Address[]>;
	findById(id: string): Promise<Address>;
	save(address: Address, manager?: EntityManager): Promise<Address>;
}
