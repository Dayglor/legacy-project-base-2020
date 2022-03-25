import path from 'path';
import { autoInjectable, inject } from 'tsyringe';

import { Excel } from './excel';
import ExcelStyles from './excelStyles';

interface ISpecification {
	id: string;
	displayName: string;
	headerStyle?: any;
	format?: string;
	width?: number;
	cellFormat?: any;
	cellStyle?: any;
}

@autoInjectable()
export class ExportXLS {
	constructor(@inject('Excel') private readonly excel: Excel) {}

	async export(name: string, data: any, spec: ISpecification[]): Promise<any> {
		const specification = spec
			.map((s) => {
				s.headerStyle = s.headerStyle || ExcelStyles.headerDark;
				return s;
			})
			.reduce((r, s) => {
				r[s.id] = s;
				return r;
			}, {});

		const report = await this.excel.buildExport({
			name,
			specification,
			data,
		});

		const filePath = path.join(__dirname, '../../..', report);

		return filePath;
	}
}
