import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import { User } from './User';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'companies' })
export class Company extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	@IsNotEmpty({ message: 'name should not be empty' })
	name: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
