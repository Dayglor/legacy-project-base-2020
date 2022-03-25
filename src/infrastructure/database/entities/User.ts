/* eslint-disable camelcase */
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Index, Entity, PrimaryColumn, Column, JoinColumn, Unique, ManyToOne, OneToOne, OneToMany } from 'typeorm';

import { AccountConfiguration } from './AccountConfiguration';
import { Address } from './Address';
import { ContactLink } from './ContactLink';
import { DatabaseEntity } from './DatabaseEntity';
import { DocumentLink } from './DocumentLink';
import { MajorityMember } from './MajorityMember';
import { ProductCategory } from './ProductCategory';
import { Role } from './Role';
import { UserBank } from './UserBank';

@Entity({ name: 'users' })
@Unique('UQ_email', ['email'])
export class User extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => Role)
	@JoinColumn({ name: 'role_id' })
	@IsNotEmpty({ message: 'role_id should not be empty' })
	role: Role;

	@ManyToOne(() => Address)
	@JoinColumn({ name: 'address_id' })
	@IsNotEmpty({ message: 'address_id should not be empty' })
	address: Address;

	@Index()
	@Column({ default: 'pre-register' }) // pre-register, registered, active, inactive
	status: string;

	@Index()
	@Column()
	@IsNotEmpty({ message: 'nationalRegistration should not be empty' })
	national_registration: string;

	@Index()
	@Column()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Column()
	// @IsNotEmpty()
	password: string;

	@Index()
	@Column()
	@IsNotEmpty({ message: 'tradingName should not be empty' })
	trading_name: string;

	@Index()
	@Column()
	company_name: string;

	@Index()
	@Column()
	gender: string;

	@Column()
	birth_date: Date;

	@Column()
	revenues: string;

	@Column()
	commision: number;

	@Column()
	goal: number;

	@Column({ nullable: true })
	zspay_id: string;

	@OneToOne(() => ContactLink)
	@JoinColumn({ name: 'contact_link_id' })
	contact_link: ContactLink;

	@OneToOne(() => DocumentLink)
	@JoinColumn({ name: 'document_link_id' })
	document_link: DocumentLink;

	@OneToMany(() => MajorityMember, (majorityMember) => majorityMember.user)
	majority_member: MajorityMember[];

	@ManyToOne(() => User, (user) => user.child)
	parent: User;

	@OneToOne(() => AccountConfiguration, (accountConfiguration) => accountConfiguration.user)
	account_configuration: AccountConfiguration;

	@OneToOne(() => User, (user) => user.parent)
	child: User[];

	@OneToOne(() => UserBank)
	// @JoinColumn({ name: 'id' })
	// @IsNotEmpty({ message: 'user_bank_id should not be empty' })
	user_bank: UserBank;

	@OneToMany(() => ProductCategory, (productCategory) => productCategory.user)
	productCategories: ProductCategory[];
}
