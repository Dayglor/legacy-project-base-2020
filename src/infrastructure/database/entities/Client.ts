/* eslint-disable camelcase */
import { IsNotEmpty } from 'class-validator';
import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne, JoinColumn, OneToOne, JoinTable } from 'typeorm';

import { Address } from './Address';
import { ContactLink } from './ContactLink';
import { DatabaseEntity } from './DatabaseEntity';
// import { DocumentLink } from './DocumentLink';
import { Sale } from './Sale';
import { User } from './User';

@Entity({ name: 'clients' })
export class Client extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	@IsNotEmpty({ message: 'trading_name should not be empty' })
	trading_name: string;

	@Column()
	company_name: string;

	@Column()
	gender: string;

	@Column()
	email: string;

	@Column()
	national_registration: string;

	@Column({ type: 'date' })
	birth_date: Date;

	@Column()
	status: string;

	@Column({ type: 'text' })
	note: string;

	@ManyToOne(() => Address, { cascade: ['soft-remove'] })
	@JoinColumn({ name: 'address_id' })
	@IsNotEmpty({ message: 'address_id should not be empty' })
	address: Address;

	@OneToOne(() => ContactLink)
	@JoinColumn({ name: 'contact_link_id' })
	contact_link: ContactLink;

	// @OneToOne(() => DocumentLink)
	// @JoinColumn({ name: 'document_link_id' })
	// document_link: DocumentLink;

	// @OneToMany(() => Sale, (sale) => sale.client, { cascade: ['soft-remove'] })
	// @JoinColumn({ name: 'client_id' })
	// @IsNotEmpty({ message: 'client_id should not be empty' })
	// sale: Sale[];

	@OneToMany(() => Sale, (sale) => sale.client)
	@JoinTable({
		name: 'sale',
		joinColumn: {
			name: 'client_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'id',
			referencedColumnName: 'client_id',
		},
	})
	sale: Sale[];

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
