import { IsNotEmpty } from 'class-validator';
import { Index, Entity, PrimaryColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';
import { Role } from './Role';

@Entity({ name: 'actions' })
export class Action extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => Action, (action) => action.child)
	parent: Action;

	@OneToMany(() => Action, (action) => action.parent)
	child: Action[];

	@Index()
	@Column()
	@IsNotEmpty()
	name: string;

	@ManyToMany(() => Role, (role) => role.actions)
	@JoinTable({
		name: 'roles_actions',
		inverseJoinColumn: {
			name: 'roleId',
			referencedColumnName: 'id',
		},
		joinColumn: {
			name: 'actionId',
			referencedColumnName: 'id',
		},
	})
	roles: Role[];
}
