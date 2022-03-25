/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Sale } from './Sale';
import { User } from './User';
// import { Consultant } from './Consultant';

@Entity({ name: 'sales_commissions' })
export class SaleCommission extends DatabaseEntity {
	@Column()
	type: number; // % ou R$ | 1 - percent, 2 - amount

	@Column()
	amount: number;

	@ManyToOne(() => Sale)
	@JoinColumn({ name: 'sale_id' })
	sale: Sale;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'consultant_id' })
	consultant: User;
}
