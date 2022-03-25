import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { Comment } from '../../database/entities/Comment';
import { ICommentRepository } from '../ICommentRepository';

@autoInjectable()
export class MysqlCommentRepository implements ICommentRepository {
	private readonly commentClient: Repository<Comment>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.commentClient = this.mysqlClient.getRepository(Comment);
	}

	async find(options: any): Promise<Comment[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const comments = await this.commentClient.find({
			skip,
			take: limit,
		});

		return comments;
	}

	async findById(id: string): Promise<Comment> {
		const comment = await this.commentClient.findOne({ id });

		return comment;
	}

	async findByCommentLinkId(commentLinkId: string): Promise<Comment[]> {
		const comments = await this.commentClient.find({
			where: {
				comment_link: <any>commentLinkId,
			},
			relations: ['comment_link'],
		});

		return comments;
	}

	async save(comment: Comment): Promise<Comment> {
		const newComment = await this.commentClient.save(comment);

		return newComment;
	}
}
