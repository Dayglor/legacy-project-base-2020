import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { User } from './User';

@Entity({ name: 'permissions' })
export class Permission extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => User)
	@JoinColumn()
	@IsNotEmpty({ message: 'userId should not be empty' })
	user: User;

	@Column()
	@IsNotEmpty()
	entityId: string;

	@Column()
	@IsNotEmpty()
	entityType: string;
}
