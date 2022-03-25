/* eslint-disable camelcase */
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

import { BillToPay } from './BillToPay';
import { CommentLink } from './CommentLink';
import { DatabaseEntity } from './DatabaseEntity';
import { DocumentLink } from './DocumentLink';
import { PaymentType } from './PaymentType';

@Entity({ name: 'bills_to_pay_proofs' })
export class BillToPayProof extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	amount_paid: number;

	@OneToOne(() => CommentLink)
	@JoinColumn({ name: 'comment_link_id' })
	comment_link: CommentLink;

	@ManyToOne(() => PaymentType)
	@JoinColumn({ name: 'payment_type_id' })
	payment_type: PaymentType;

	@Column()
	transfer_type: string;

	@ManyToOne(() => BillToPay)
	@JoinColumn({ name: 'bill_to_pay_id' })
	bill_to_pay: BillToPay;

	@OneToOne(() => DocumentLink)
	@JoinColumn({ name: 'document_link_id' })
	document_link: DocumentLink;
}
