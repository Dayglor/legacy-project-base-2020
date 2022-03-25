/* eslint-disable camelcase */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { User } from './User';

@Entity({ name: 'cards' })
export class Card extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column()
	bin: string;

	@Column()
	name: string;

	@Column()
	month: string;

	@Column()
	year: string;

	@Column()
	brand: string;

	@Column()
	external_id: string;
}
