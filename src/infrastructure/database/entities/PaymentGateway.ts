/* eslint-disable camelcase */
import { Entity, Column, PrimaryColumn } from 'typeorm';

// import { Addre } from './Action';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'payments_gateways' })
export class AccountConfiguration extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	title: string;

	@Column()
	site_url: string;
}
