/* eslint-disable camelcase */
import { Entity, Column } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'sales_types' })
export class SaleType extends DatabaseEntity {
	@Column()
	reference: number;

	@Column()
	name: string;
}
