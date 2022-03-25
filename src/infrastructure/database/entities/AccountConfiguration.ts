/* eslint-disable camelcase */
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';

// import { Addre } from './Action';
import { DatabaseEntity } from './DatabaseEntity';
import { User } from './User';

@Entity({ name: 'accounts_configurations' })
export class AccountConfiguration extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	external_plan_id: string;

	@Column()
	external_signature_id: string;

	@Column()
	payment_gateway_id: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	next_due_date: Date;

	@Column()
	free_days: number;

	@Column()
	amount: number;

	@Column()
	setup_amount: number;

	@Column()
	free_invoice: number;

	@Column()
	free_query: number;

	@Column()
	free_product_invoice: number;

	@Column()
	private_key: string;

	@Column()
	token: string;

	@OneToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
