import { IsNotEmpty } from 'class-validator';
import { Index, Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { Action } from './Action';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'roles' })
export class Role extends DatabaseEntity {
	@ManyToOne(() => Role, (role) => role.child)
	parent: Role;

	@OneToMany(() => Role, (role) => role.parent)
	child: Role[];

	@Index()
	@Column()
	@IsNotEmpty()
	name: string;

	@ManyToMany(() => Action, (action) => action.roles)
	@JoinTable({
		name: 'roles_actions',
		joinColumn: {
			name: 'roleId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'actionId',
			referencedColumnName: 'id',
		},
	})
	actions: Action[];
}
