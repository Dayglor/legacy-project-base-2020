import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import ExcelStyles from '@infrastructure/export/excelStyles';
import { ExportXLS } from '@infrastructure/export/ExportXLS';
import { Utils } from '@infrastructure/utils';

import { IGetSalesDTO } from '../GetSales/GetSalesDTO';
import { GetSalesUseCase } from '../GetSales/GetSalesUseCase';
import { filter } from 'lodash';

@autoInjectable()
export class ExportSalesController {
	constructor(private readonly exportXLS: ExportXLS, private readonly getSalesUseCase: GetSalesUseCase) {}

	async handle(request: Request, response: Response): Promise<any> {
		request.query.currentUser = <any>request.currentUser;
		const filters: IGetSalesDTO = <any>request.query;

		delete filters.page;
		filters.limit = 999999999;

		const { sales } = await this.getSalesUseCase.execute(filters);

		const specification = [
			{
				id: 'id',
				displayName: 'ID',
				width: 200,
			},
			{
				id: 'created',
				displayName: 'Data da Venda',
				format: 'date',
				width: 200,
			},
			{
				id: 'client',
				displayName: 'Cliente',
				width: 200,
			},
			{
				id: 'amount',
				displayName: 'Valor',
				width: 200,
				format: 'money',
				cellFormat: (v: any) => +v,
				cellStyle: (v: any, row: any) => {
					if (Utils.isset(() => row.footer) && row.footer) {
						return { ...ExcelStyles.footer, ...ExcelStyles.money };
					}
					return ExcelStyles.money;
				},
			},
			{
				id: 'paymentMethod',
				displayName: 'Forma de Pagamento',
				width: 200,
			},
		];

		const data = sales.map((s) => {
			const [firstPayment] = s.payments;
			return {
				id: s.id,
				created: s.created,
				client: s.client?.trading_name,
				amount: +s.amount / 100,
				paymentMethod: firstPayment?.payment_type?.name,
			};
		});

		const filePath = await this.exportXLS.export('Sales', data, specification);

		response.attachment(`sales_${new Date().getTime()}.xlsx`);
		return response.sendFile(filePath);
	}
}
