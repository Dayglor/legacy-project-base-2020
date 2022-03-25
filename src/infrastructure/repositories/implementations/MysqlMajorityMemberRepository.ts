import { autoInjectable, inject } from 'tsyringe';
import { Connection, FindOneOptions, Repository } from 'typeorm';

import { MajorityMember } from '@infrastructure/database/entities/MajorityMember';

import { IMajorityMemberRepository } from '../IMajorityMemberRepository';

@autoInjectable()
export class MysqlMajorityMemberRepository implements IMajorityMemberRepository {
	private readonly majorityMemberClient: Repository<MajorityMember>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.majorityMemberClient = this.mysqlClient.getRepository(MajorityMember);
	}
	async find(options: any): Promise<MajorityMember[]> {
		const { limit, page } = options;
		const skip = (+page - 1) * +limit;

		const majorityMembers = await this.majorityMemberClient.find({
			skip,
			take: limit,
		});

		return majorityMembers;
	}

	async findById(id: string): Promise<MajorityMember> {
		const majorityMember = await this.majorityMemberClient.findOne({ id });

		return majorityMember;
	}

	async findByUserId(userId: string): Promise<MajorityMember> {
		const majorityMember = await this.majorityMemberClient.findOne({ user: <any>userId });

		return majorityMember;
	}

	async findByEmail(email: string): Promise<MajorityMember> {
		const queryOptions: FindOneOptions = {};

		const majorityMember = await this.majorityMemberClient.findOne({ email }, queryOptions);

		return majorityMember;
	}

	async findByNationalRegistration(nationalRegistration: string): Promise<MajorityMember> {
		const queryOptions: FindOneOptions = {};

		const majorityMember = await this.majorityMemberClient.findOne(
			{ national_registration: nationalRegistration },
			queryOptions
		);

		return majorityMember;
	}

	async save(majorityMember: MajorityMember): Promise<MajorityMember> {
		const newMajorityMember = await this.majorityMemberClient.save(majorityMember);

		return newMajorityMember;
	}
}
