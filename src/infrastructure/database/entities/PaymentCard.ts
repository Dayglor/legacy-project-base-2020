/* eslint-disable camelcase */

import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Card } from './Card';
import { DatabaseEntity } from './DatabaseEntity';
import { Payment } from './Payment';

@Entity({ name: 'payment_cards' })
export class PaymentCard extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	card_id: string;

	@ManyToOne(() => Payment)
	@JoinColumn({
		name: 'payment_id',
	})
	payment: Payment;

	@ManyToOne(() => Card)
	@JoinColumn({
		name: 'card_id',
	})
	card: Card;
}
