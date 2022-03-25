/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { ProductCategory } from './ProductCategory';
import { User } from './User';

@Entity({ name: 'products' })
export class Product extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	product_code: string;

	@Column()
	sku: string;

	@Column()
	cost_price: string;

	@Column()
	sale_price: string;

	@Column()
	stock: string;

	@Column()
	stock_quantity: number;

	@Column()
	ICMS_percentage: number;

	@Column()
	ICMS_value: number;

	@Column()
	IPI_percentage: number;

	@Column()
	IPI_value: number;

	@Column()
	PIS_percentage: number;

	@Column()
	PIS_value: number;

	@Column()
	COFINS_percentage: number;

	@Column()
	COFINS_value: number;

	@Column()
	status: string;

	@ManyToOne(() => ProductCategory)
	@JoinColumn({ name: 'product_category_id' })
	product_category: ProductCategory;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
