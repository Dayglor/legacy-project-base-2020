import { Index, Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, PrimaryColumn, OneToOne } from 'typeorm';

import { Subscription } from './Subscription';
import { Sale } from './Sale';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'subscriptions_invoices' })
export class SubscriptionInvoice extends DatabaseEntity {

	@PrimaryColumn()
	id: string;

	@Column({type: 'date'})
	payment_date: string;

	@Column()
	status: string;

	@ManyToOne(() => Subscription )
	@JoinTable({
		name: 'subscription',
		joinColumn: {
			name: 'subscription_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'id',
			referencedColumnName: 'subscription_id',
		},
	})
	subscription: Subscription;

	@OneToOne(() => Sale )
	@JoinTable({
		name: 'sale',
		joinColumn: {
			name: 'sale_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'id',
			referencedColumnName: 'sale_id',
		},
	})
	sale: Sale;
}
