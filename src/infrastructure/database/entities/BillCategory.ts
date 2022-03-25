import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import { User } from './User';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'bills_categories' })
export class BillCategory extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	@IsNotEmpty({ message: 'title should not be empty' })
	title: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
