import axios from 'axios';
import { autoInjectable } from 'tsyringe';

import { IGetCPFDTO } from './GetCPFDTO';
import { CompanyConsulting } from '@infrastructure/external-providers/scoreGateway/implementations/CompanyConsulting';

@autoInjectable()
export class GetCPFUseCase {
	constructor(
		private readonly companyConsulting: CompanyConsulting,
	) {}

	async execute(data: IGetCPFDTO): Promise<any> {
		const tipo = '1';

		const result = await this.companyConsulting.consult(data.cpfSearch, tipo);

		return result;
	}
}
