import axios from 'axios';
import { autoInjectable } from 'tsyringe';

import { IGetCNPJDTO } from './GetCNPJDTO';

@autoInjectable()
export class GetCNPJUseCase {
	async execute(data: IGetCNPJDTO): Promise<any> {
		const cnpj = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${data.cnpjSearch}`);
		return cnpj;
	}
}
