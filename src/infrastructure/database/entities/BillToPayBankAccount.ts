/* eslint-disable camelcase */
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

import { Bank } from './Bank';
import { DatabaseEntity } from './DatabaseEntity';
import { BillToPayProof } from './BillToPayProof';

@Entity({ name: 'bills_to_pay_banks_accounts' })
export class BillToPayBankAccount extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	agency: string;

	@Column()
	account_number: string;

	@Column()
	type: string;

	@OneToOne(() => BillToPayProof)
	@JoinColumn({ name: 'bill_to_pay_proof_id' })
	@IsNotEmpty({ message: 'bill_to_pay_proof_id should not be empty' })
	billToPayProof: BillToPayProof;

	@ManyToOne(() => Bank)
	@JoinColumn({ name: 'bank_id' })
	@IsNotEmpty({ message: 'bank_id should not be empty' })
	bank: Bank;
}
