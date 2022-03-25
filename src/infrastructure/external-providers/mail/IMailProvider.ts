import { Client } from '@infrastructure/database/entities/Client';
// import { Payment } from '@infrastructure/database/entities/Payment';
// import { Product } from '@infrastructure/database/entities/Product';
import { IRegisterSaleProduct } from '@infrastructure/factories/ProductFactory';

interface IAddress {
	email: string;
	name: string;
}

interface IPaymentType {
	name: string;
	reference: number;
}

interface IPayments {
	paymentType?: IPaymentType;
	installments?: number;
	amount?: string;
	id?: string;
}

export interface IMessage {
	to: IAddress;
	// from: IAddress;
	subject: string;
	body: string;
}

export interface ISaleMail {
	client: Client;
	products: IRegisterSaleProduct[];
	payments: IPayments[];
	valueTotal: string;
}

export interface IConsultantMail {
	name: string;
	email: string;
	password: string;
}

export interface IApprovePreRegisterMail {
	name: string;
	email: string;
	password: string;
}

export interface IPreRegisterMail {
	name: string;
	email: string;
}

export interface ISendMail {
	to: string;
	from: string;
	subject: string;
	html: string;
}

export interface IMailProvider {
	sendMail(message: IMessage): Promise<void>;
	sendSaleMail(data: ISaleMail): Promise<void>;
	sendConsultantMail(data: IConsultantMail): Promise<void>;
	sendApprovePreRegisterMail(data: IApprovePreRegisterMail): Promise<void>;
	sendPreRegisterMail(data: IPreRegisterMail): Promise<void>;
}
