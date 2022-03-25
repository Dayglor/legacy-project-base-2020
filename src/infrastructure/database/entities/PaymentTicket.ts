/* eslint-disable camelcase */
import { Entity, Column, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Payment } from './Payment';

@Entity({ name: 'payments_tickets' })
export class PaymentTicket extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	url: string;

	@Column()
	barcode: string;

	@Column({ type: 'text' })
	description: string;

	@Column({ type: 'date' })
	due_date: Date;

	@Column()
	interest: number;

	@Column()
	late_fee: number;

	@OneToOne(() => Payment)
	@JoinColumn({ name: 'payment' })
	payment: Payment;
}
