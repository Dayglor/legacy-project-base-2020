import parseISO from 'date-fns/parseISO';
import { autoInjectable, inject } from 'tsyringe';

import { Receivable } from '@infrastructure/database/entities/Receivable';
import { PagSeguroPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/pagseguro/PagSeguroPaymentGatewayProvider';
import { IReceivableRepository } from '@infrastructure/repositories/IReceivableRepository';
import { Utils } from '@infrastructure/utils';

interface IPagSeguroTransactionData {
	code: string;
	installmentCount: string;
	grossAmount: string;
	netAmount: string;
	feeAmount: string;
	discountAmount: string;
	extraAmount: string;
	status: string;
	date: string;
}

@autoInjectable()
export class ReceivableFactory {
	constructor(@inject('IReceivableRepository') private readonly receivableRepository: IReceivableRepository) {}

	async makeFromPagSeguroTransaction(data: IPagSeguroTransactionData): Promise<Receivable[]> {
		const receivables = [];
		const { code, installmentCount, grossAmount, netAmount, feeAmount, status, date } = data;
		const arr = Array.from(Array(+installmentCount).keys());

		const installmentGrossAmount = (+grossAmount / +installmentCount).toFixed(2);
		const installmentNetAmount = (+netAmount / +installmentCount).toFixed(2);
		const installmentFeeAmount = (+feeAmount / +installmentCount).toFixed(2);

		await Utils.forEachAsync2(arr, async (_a: any, i: any) => {
			const newReceivable = new Receivable();

			newReceivable.external_id = code;
			newReceivable.installment = i + 1;
			newReceivable.status = PagSeguroPaymentGatewayProvider.transactionStatus(+status);
			newReceivable.gross_amount = +installmentGrossAmount * 100;
			newReceivable.net_amount = +installmentNetAmount * 100;
			newReceivable.fee_amount = +installmentFeeAmount * 100;
			newReceivable.paid_date = parseISO(date);

			receivables.push(newReceivable);
		});

		return receivables;
	}
}
