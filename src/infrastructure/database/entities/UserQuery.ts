/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Sale } from './Sale';
import { User } from './User';

@Entity({ name: 'users_queries' })
export class UserQuery extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	quantity_available: number;

	@Column()
	type: string;

	@ManyToOne(() => User)
	@JoinColumn({
		name: 'user_id',
	})
	user: User;

	@ManyToOne(() => Sale)
	@JoinColumn({
		name: 'sale_id',
	})
	sale: Sale;
}
