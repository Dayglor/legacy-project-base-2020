import { CommentLink } from '../database/entities/CommentLink';

export interface ICommentLinkRepository {
	find(options?: any): Promise<CommentLink[]>;
	findById(id: string): Promise<CommentLink>;
	save(commentLink: CommentLink): Promise<CommentLink>;
}
