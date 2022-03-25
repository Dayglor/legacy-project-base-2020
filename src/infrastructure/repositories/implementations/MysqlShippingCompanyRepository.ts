import { autoInjectable, inject } from 'tsyringe';
import { Connection, Like, Repository } from 'typeorm';

import { ShippingCompany } from '@infrastructure/database/entities/ShippingCompany';
import { IGetShippingCompaniesDTO } from '@useCases/ShippingCompanies/GetShippingCompanies/GetShippingCompaniesDTO';

import { IShippingCompanyRepository } from '../IShippingCompanyRepository';

@autoInjectable()
export class MysqlShippingCompanyRepository implements IShippingCompanyRepository {
	private readonly shippingCompanyClient: Repository<ShippingCompany>;

	constructor(@inject('MysqlClient') private readonly mysqlClient: Connection) {
		this.shippingCompanyClient = this.mysqlClient.getRepository(ShippingCompany);
	}

	async find(options: IGetShippingCompaniesDTO): Promise<ShippingCompany[]> {
		// const { limit, page, searchByDocument, tradingName, userId } = options;
		const { limit, page, searchByName, userId } = options;

		const skip = (+page - 1) * +limit;

		const where: any = {};

		if (userId) {
			where.user = userId;
		}

		if (searchByName) {
			where.trading_name = Like(`%${searchByName}%`);
		}

		// if (searchByDocument) {
		// 	where = { document: searchByDocument };
		// }

		const shippingCompanies = await this.shippingCompanyClient.find({
			where,
			relations: ['address', 'contact_link', 'contact_link.contact', 'document_link', 'document_link.document'],
			skip,
			take: limit,
			order: {
				created: 'DESC',
			},
		});

		return shippingCompanies;
	}

	async findById(id: string): Promise<ShippingCompany> {
		const shippingCompany = await this.shippingCompanyClient.findOne(
			{ id },
			{ relations: ['address', 'contact_link', 'contact_link.contact', 'document_link', 'document_link.document'] }
		);

		return shippingCompany;
	}

	async save(shippingCompany: ShippingCompany): Promise<ShippingCompany> {
		const newShippingCompany = await this.shippingCompanyClient.save(shippingCompany);

		return newShippingCompany;
	}

	async delete(id: string): Promise<void> {
		await this.shippingCompanyClient.softDelete({ id });
	}
}
