/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Product } from './Product';
import { Sale } from './Sale';

@Entity({ name: 'sales_products' })
export class SaleProduct extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	amount: string;

	@Column()
	quantity: number;

	@ManyToOne(() => Sale)
	@JoinColumn({ name: 'sale_id' })
	sale: Sale;

	@ManyToOne(() => Product)
	@JoinColumn({ name: 'product_id' })
	product: Product;
}
