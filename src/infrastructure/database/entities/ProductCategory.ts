import { Index, Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { User } from './User';

@Entity({ name: 'products_categories' })
export class ProductCategory extends DatabaseEntity {
	@Index()
	@Column()
	title: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
