/* eslint-disable camelcase */
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

import { Address } from './Address';
import { ContactLink } from './ContactLink';
import { DatabaseEntity } from './DatabaseEntity';
import { DocumentLink } from './DocumentLink';
import { User } from './User';

@Entity({ name: 'majorities_members' })
export class MajorityMember extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Index()
	@Column()
	@IsNotEmpty({ message: 'majorities_members.tradingName should not be empty' })
	trading_name: string;

	@Index()
	@Column()
	company_name: string;

	@Index()
	@Column()
	@IsNotEmpty({ message: 'majorities_members.nationalRegistration should not be empty' })
	national_registration: string;

	@Index()
	@Column()
	// @IsEmail({}, { message: 'majorities_members.email must be an email' })
	// @IsNotEmpty({ message: 'majorities_members.email should not be empty' })
	email: string;

	@Column()
	birth_date: Date;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	@IsNotEmpty({ message: 'user_id should not be empty' })
	user: User;

	@ManyToOne(() => Address)
	@JoinColumn({ name: 'address_id' })
	@IsNotEmpty({ message: 'address_id should not be empty' })
	address: Address;

	@OneToOne(() => ContactLink)
	@JoinColumn({ name: 'contact_link_id' })
	contact_link: ContactLink;

	@OneToOne(() => DocumentLink)
	@JoinColumn({ name: 'document_link_id' })
	document_link: DocumentLink;
}
