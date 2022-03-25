/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { Client } from './Client';
import { DatabaseEntity } from './DatabaseEntity';
import { Delivery } from './Delivery';
import { DocumentLink } from './DocumentLink';
import { Payment } from './Payment';
import { SaleCommission } from './SaleCommission';
import { SaleProduct } from './SaleProduct';
import { SaleType } from './SaleType';
import { User } from './User';

@Entity({ name: 'sales' })
export class Sale extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	gross_amount: number;

	@Column()
	amount: number;

	@Column()
	installments: number;

	@Column({ type: 'text' })
	notes: string;

	@Column({ type: 'text' })
	discount_type: string;

	@Column({ type: 'text' })
	discount_amount: string;

	@Column({ type: 'text' })
	discount_reason: string;

	@ManyToOne(() => SaleType)
	@JoinColumn({ name: 'sale_type_id' })
	sale_type: SaleType;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_created_id' })
	user_created: User;

	@ManyToOne(() => Client)
	@JoinColumn({ name: 'client_id' })
	client: Client;

	// @ManyToMany(() => Product)
	// @JoinTable({
	// 	name: 'sales_products',
	// 	joinColumn: {
	// 		name: 'sale_id',
	// 		referencedColumnName: 'id',
	// 	},
	// 	inverseJoinColumn: {
	// 		name: 'product_id',
	// 		referencedColumnName: 'id',
	// 	},
	// })
	// saleProducts: Product[];

	@OneToMany(() => SaleProduct, (saleProduct) => saleProduct.sale)
	saleProduct: SaleProduct[];

	@OneToMany(() => SaleCommission, (saleCommission) => saleCommission.sale)
	saleCommissions: SaleCommission[];

	@OneToMany(() => Payment, (payment) => payment.sale)
	payments: Payment[];

	@OneToOne(() => DocumentLink)
	@JoinColumn({ name: 'document_link_id' })
	document_link: DocumentLink;

	@OneToOne(() => Delivery, (delivery) => delivery.sale)
	delivery: Delivery;
}
