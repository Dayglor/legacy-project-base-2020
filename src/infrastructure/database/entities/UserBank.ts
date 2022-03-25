/* eslint-disable camelcase */
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

// import { Address } from './Address';
import { Bank } from './Bank';
// import { ContactLink } from './ContactLink';
import { DatabaseEntity } from './DatabaseEntity';
// import { DocumentLink } from './DocumentLink';
import { User } from './User';

@Entity({ name: 'users_banks' })
export class UserBank extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	// @Index()
	@Column()
	// @IsNotEmpty({ message: 'agency should not be empty' })
	agency: string;

	// @Column()
	// // @IsNotEmpty({ message: 'digit should not be empty' })
	// digit: string;

	@Column()
	account_number: string;

	@Column()
	type: string;

	@OneToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	@IsNotEmpty({ message: 'user_id should not be empty' })
	user: User;

	@ManyToOne(() => Bank)
	@JoinColumn({ name: 'bank_id' })
	@IsNotEmpty({ message: 'bank_id should not be empty' })
	bank: Bank;
}
