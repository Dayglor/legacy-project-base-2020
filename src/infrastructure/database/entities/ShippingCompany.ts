/* eslint-disable camelcase */
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

import { Address } from './Address';
import { ContactLink } from './ContactLink';
import { DatabaseEntity } from './DatabaseEntity';
import { DocumentLink } from './DocumentLink';
import { User } from './User';

@Entity({ name: 'shipping_companies' })
export class ShippingCompany extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	@IsNotEmpty()
	national_registration: string;

	@Column()
	@IsNotEmpty()
	trading_name: string;

	@Column()
	@IsNotEmpty()
	company_name: string;

	@Column()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Column({ type: 'text' })
	note: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	@IsNotEmpty({ message: 'user_id should not be empty' })
	user: User;

	@OneToOne(() => ContactLink)
	@JoinColumn({ name: 'contact_link_id' })
	contact_link: ContactLink;

	@OneToOne(() => DocumentLink)
	@JoinColumn({ name: 'document_link_id' })
	document_link: DocumentLink;

	@ManyToOne(() => Address)
	@JoinColumn({ name: 'address_id' })
	@IsNotEmpty({ message: 'address_id should not be empty' })
	address: Address;
}
