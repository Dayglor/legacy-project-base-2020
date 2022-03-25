import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Repository } from 'typeorm';

import { Delivery } from '../../database/entities/Delivery';
import { IDeliveryRepository } from '../IDeliveryRepository';

@autoInjectable()
export class MysqlDeliveryRepository implements IDeliveryRepository {
	private readonly deliveryClient: Repository<Delivery>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.deliveryClient = this.mysqlClient.getRepository(Delivery);
	}
	async find(options: any): Promise<Delivery[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const deliveries = await this.deliveryClient.find({
			skip,
			take: limit,
		});

		return deliveries;
	}

	async findById(id: string): Promise<Delivery> {
		const delivery = await this.deliveryClient.findOne({ id });

		return delivery;
	}

	async save(delivery: Delivery, manager?: EntityManager): Promise<Delivery> {
		let client: any = manager;
		if (!client) {
			client = this.deliveryClient;
		}
		const newDelivery = await client.save(delivery);

		return newDelivery;
	}
}
