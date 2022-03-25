import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository, Equal } from 'typeorm';

import { Company } from '@infrastructure/database/entities/Company';

import { ICompanyRepository } from '../ICompanyRepository';

@autoInjectable()
export class MysqlCompanyRepository implements ICompanyRepository {
	private readonly companyClient: Repository<Company>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.companyClient = this.mysqlClient.getRepository(Company);
	}
	async find(options: any): Promise<Company[]> {
		const { name, userId } = options;

		const where: any = {};

		if (name) {
			where.name = Like(`%${name}%`);
		}

		if (userId) {
			where.user = Equal(`${userId}`);
		}

		const companies = await this.companyClient.find({
			where,
		});

		return companies;
	}

	async findById(id: string): Promise<Company> {
		const company = await this.companyClient.findOne({ id });

		return company;
	}

	async save(company: Company): Promise<Company> {
		const newCompany = await this.companyClient.save(company);

		return newCompany;
	}
}
