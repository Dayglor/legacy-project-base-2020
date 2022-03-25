/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Payment } from './Payment';

@Entity({ name: 'receivables' })
export class Receivable extends DatabaseEntity {
	@Column()
	status: string;

	@Column()
	gross_amount: number;

	@Column()
	fee_amount: number;

	@Column()
	net_amount: number;

	@Column()
	installment: number;

	@Column()
	external_id: string;

	@Column({ type: 'date' })
	paid_date: Date;

	@ManyToOne(() => Payment)
	@JoinColumn({ name: 'payment_id' })
	payment: Payment;
}
