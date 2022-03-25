import { Address } from '@domain/Address';
import { IRegisterSaleProduct } from '@infrastructure/factories/ProductFactory';
import { IRegisterClientDTO } from '@useCases/Clients/RegisterClient/RegisterClientDTO';

interface IRegisterSaleClient extends IRegisterClientDTO {
	id?: string;
	name: string;
}

interface IRegisterSaleCommission {
	userId: string;
	commissionType: number; // 1 - percent, 2 - amount
	commission: number;
}

interface IRegisterSaleFile {
	fileType: number; // 1 - Comprovante, 2 - Nota Fiscal, 0 - Outros
	name: string;
	type: string;
	size: number;
	path: string;
}

export interface IRegisterSalePayment {
	id?: string;
	paymentType: number; // 1 - Crédito, 2 - Débito, 3 - Boleto, 4 - Recorrência, 5 - Link de Pagamento, 6 - Cheque
	amount: number;
	installments?: number;
	// 1 - Crédito
	// 2 - Débito
	authorizationCode?: string; // Número de Comprovante (POS)
	// 3 - Boleto
	createTicket?: any;
	sendMail?: any;
	dueDate?: string;
	interest?: number;
	lateFee?: number;
	generateBillets?: boolean;
	sendEmail?: boolean;
	// 4 - Recorrência
	cardOwner?: string;
	cardNumber?: string;
	cardCvv?: string;
	cardExpirationMonth?: string;
	cardExpirationYear?: string;
	// 5 - Link de Pagamento
	maxInstallments?: number;
	expirationDate?: string;
	// 6 - Cheque
	checkNumber?: string;
	bankId?: string;
	date?: string;
}

export interface IRegisterSaleDTO {
	userId: string;
	products: IRegisterSaleProduct[];
	client: IRegisterSaleClient;
	commissions: IRegisterSaleCommission[];
	deliveryAddress: Address;
	deliveryFee?: number;
	payments: IRegisterSalePayment[];
	notes?: string;
	files?: IRegisterSaleFile[];
	reasonForDiscount?: string;
	discountType?: string;
	discount?: string;
	sendMailToClient?: boolean;
	shipping?: {
		deliveryType?: string;
		shippingCompanyId?: string;
		enableShippingFee?: boolean;
		shippingFee: string;
		shipped?: boolean;
	};
}
