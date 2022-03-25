/* eslint-disable camelcase */
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';

import { BillCategory } from './BillCategory';
import { CommentLink } from './CommentLink';
import { Company } from './Company';
import { DatabaseEntity } from './DatabaseEntity';
import { DocumentLink } from './DocumentLink';
import { User } from './User';

@Entity({ name: 'bills_to_pay' })
export class BillToPay extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	amount: number;

	@Column({ type: 'date' })
	due_date: string;

	@Column()
	status: string;

	@Column({ type: 'date' })
	payment_date: string;

	@ManyToOne(() => BillCategory)
	@JoinColumn({ name: 'bill_category_id' })
	bill_category: BillCategory;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Company)
	@JoinColumn({ name: 'company_id' })
	company: Company;

	@OneToOne(() => CommentLink)
	@JoinColumn({ name: 'comment_link_id' })
	comment_link: CommentLink;

	@OneToOne(() => DocumentLink)
	@JoinColumn({ name: 'document_link_id' })
	document_link: DocumentLink;
}
