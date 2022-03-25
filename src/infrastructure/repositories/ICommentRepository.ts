import { Comment } from '../database/entities/Comment';

export interface ICommentRepository {
	find(options?: any): Promise<Comment[]>;
	findById(id: string): Promise<Comment>;
	findByCommentLinkId(commentLinkId: string): Promise<Comment[]>;
	save(comment: Comment): Promise<Comment>;
}
