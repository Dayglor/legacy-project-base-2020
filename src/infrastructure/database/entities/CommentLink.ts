import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Comment } from './Comment';
import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'comments_links' })
export class CommentLink extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@OneToMany(() => Comment, (comment) => comment.comment_link)
	comment: Comment[];
}
