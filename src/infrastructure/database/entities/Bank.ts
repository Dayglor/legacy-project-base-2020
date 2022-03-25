import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'banks' })
export class Bank extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	@IsNotEmpty({ message: 'title should not be empty' })
	name: string;

	@Column()
	@IsNotEmpty({ message: 'cod should not be empty' })
	cod: string;

	@Column()
	@IsNotEmpty({ message: 'priority should not be empty' })
	priority: number;
}
