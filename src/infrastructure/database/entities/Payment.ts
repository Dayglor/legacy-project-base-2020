/* eslint-disable camelcase */
import { IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';

import { Bank } from './Bank';
import { DatabaseEntity } from './DatabaseEntity';
import { PaymentTicket } from './PaymentTicket';
import { PaymentType } from './PaymentType';
import { Receivable } from './Receivable';
import { Sale } from './Sale';

@Entity({ name: 'payments' })
export class Payment extends DatabaseEntity {
	@Column({ default: 'pending' })
	status: string;

	@Column()
	@IsNotEmpty()
	amount: number;

	@Column()
	fine: number; // multa

	@Column()
	fee: number; // taxa

	@Column()
	amount_received: number;

	// @Column()
	// received_date: string;

	// @Column()
	// payment_date: string;

	@Column()
	installments: number;

	@Column()
	max_installments: number;

	@Column()
	external_id: string;

	@Column()
	external_plan_id: string;

	@Column({ nullable: true })
	external_payment_date: Date;

	@Column()
	gateway: string;

	@Column()
	authorization_code: string;

	@Column()
	check_number: string;

	@ManyToOne(() => Bank)
	@JoinColumn({ name: 'bank_id' })
	bank: Bank;

	@Column({
		nullable: true,
	})
	check_date: Date;

	@Column({ type: 'date', nullable: true, default: null })
	expiration_date: Date;

	@ManyToOne(() => PaymentType)
	@IsNotEmpty({ message: 'paymentType should not be empty.' })
	@JoinColumn({ name: 'payment_type_id' })
	payment_type: PaymentType;

	@ManyToOne(() => Sale)
	@JoinColumn({ name: 'sale_id' })
	sale: Sale;

	@OneToOne(() => PaymentTicket, (paymentTicket) => paymentTicket.payment)
	payment_ticket: PaymentTicket;

	@OneToMany(() => Receivable, (receivable) => receivable.payment)
	receivables: Receivable[];
}
