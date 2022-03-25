/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, JoinTable, PrimaryColumn, OneToOne } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Plan } from './Plan';
import { User } from './User';

@Entity({ name: 'subscriptions' })
export class Subscription extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	status: string;

	@Column()
	active: number;

	@Column({ type: 'date' })
	due_date: string;

	@Column({ type: 'date' })
	membership_date: string;

	@Column({ type: 'date' })
	expiration_date: string;

	@Column({ type: 'date' })
	suspension_date: string;

	@OneToOne(() => Plan)
	@JoinTable({
		name: 'plan',
		joinColumn: {
			name: 'plan_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'id',
			referencedColumnName: 'plan_id',
		},
	})
	plan: Plan;

	@ManyToOne(() => User)
	@JoinTable({
		name: 'user',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'id',
			referencedColumnName: 'user_id',
		},
	})
	user: User;
}
