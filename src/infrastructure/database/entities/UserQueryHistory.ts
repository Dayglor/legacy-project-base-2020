import { Entity, Column, ManyToOne, JoinTable, PrimaryColumn } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { User } from './User';

@Entity({ name: 'users_queries_histories' })
export class UserQueryHistory extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	document: string;

	@Column('text')
	response: string;

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
