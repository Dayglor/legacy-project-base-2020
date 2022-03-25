/* eslint-disable camelcase */
import { Entity, Column, OneToOne, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';

import { Address } from './Address';
import { DatabaseEntity } from './DatabaseEntity';
import { Sale } from './Sale';
import { ShippingCompany } from './ShippingCompany';

@Entity({ name: 'deliveries' })
export class Delivery extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	delivery_fee: string;

	@Column()
	customer_fee: boolean;

	@Column({ default: false })
	shipped: boolean;

	@Column()
	type: string;

	@OneToOne(() => Address)
	@JoinColumn({ name: 'address_id' })
	address: Address;

	@OneToOne(() => Sale)
	@JoinColumn({ name: 'sale_id' })
	sale: Sale;

	@ManyToOne(() => ShippingCompany)
	@JoinColumn({ name: 'shipping_company_id' })
	shippingCompany: ShippingCompany;
}
