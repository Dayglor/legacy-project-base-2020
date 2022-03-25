/* eslint-disable camelcase */
import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn } from 'typeorm';

// import { Addre } from './Action';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'addresses' })
export class Address extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	// @Column()
	// address_type_id: string;

	@Column()
	external_id: string;

	@Column()
	street: string;

	@Column()
	number: number;

	@Column()
	complement: string;

	@Column()
	city: string;

	@Column()
	state: string;

	@Column()
	neighborhood: string;

	@Column()
	@IsNotEmpty({ message: 'O CEP não pode ser vazio.' })
	postal_code: string;

	@Column()
	country: string;
}
