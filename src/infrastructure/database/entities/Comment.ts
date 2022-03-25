/* eslint-disable camelcase */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CommentLink } from './CommentLink';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'comments' })
export class Comment extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => CommentLink)
	@JoinColumn({ name: 'comment_link_id' })
	comment_link: CommentLink;

	@Column()
	comment: string;
}
