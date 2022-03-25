/* eslint-disable camelcase */
import { Entity, Column } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'payments_types' })
export class PaymentType extends DatabaseEntity {
	@Column()
	reference: number;

	@Column()
	name: string;
}
