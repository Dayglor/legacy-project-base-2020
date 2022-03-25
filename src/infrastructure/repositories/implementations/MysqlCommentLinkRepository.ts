import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { CommentLink } from '../../database/entities/CommentLink';
import { ICommentLinkRepository } from '../ICommentLinkRepository';

@autoInjectable()
export class MysqlCommentLinkRepository implements ICommentLinkRepository {
	private readonly commentLinkClient: Repository<CommentLink>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.commentLinkClient = this.mysqlClient.getRepository(CommentLink);
	}
	async find(options: any): Promise<CommentLink[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const commentLinks = await this.commentLinkClient.find({
			skip,
			take: limit,
		});

		return commentLinks;
	}

	async findById(id: string): Promise<CommentLink> {
		const commentLink = await this.commentLinkClient.findOne({ id });

		return commentLink;
	}

	async save(commentLink: CommentLink): Promise<CommentLink> {
		const newCommentLink = await this.commentLinkClient.save(commentLink);

		return newCommentLink;
	}
}
