import { IsNotEmpty } from 'class-validator';
import { Index, Entity, Column, ManyToOne, OneToMany, Unique, JoinColumn } from 'typeorm';

import { Action } from './Action';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'menus' })
@Unique(['url'])
export class Menu extends DatabaseEntity {
	@ManyToOne(() => Menu, (menu) => menu.parent)
	parent: Menu;

	@OneToMany(() => Menu, (menu) => menu.child)
	// @JoinColumn({ name: 'id' })
	child: Menu[];

	@Index()
	@Column({ nullable: false })
	@IsNotEmpty({ message: 'title should not be empty' })
	title: string;

	@Column({ nullable: false })
	url: string;

	@Column({ nullable: true })
	icon: string;

	@ManyToOne(() => Action)
	@JoinColumn({ name: 'action_id' })
	action: Action;
}
