import { Index, Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, PrimaryColumn, OneToOne } from 'typeorm';

import { ProductCategory } from './ProductCategory';
import { User } from './User';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'plans' })
export class Plan extends DatabaseEntity {

	@PrimaryColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	notification_mail: string;

	@Column()
	payment_method: string;

	@Column()
	frequency: string;

	@Column()
	interval: number;

	@Column()
	amount: number;

	@Column()
	setup: number;

	@Column()
	currency: string;

	@Column()
	free_period: number;

	@Column()
	tolerance_period: number;

	@Column()
	subscription_duration: number;

	@Column({type: 'date'})
	subscription_expiratiion: string;

	@Column({type: 'date'})
	expiration_plan_date: string;
}
