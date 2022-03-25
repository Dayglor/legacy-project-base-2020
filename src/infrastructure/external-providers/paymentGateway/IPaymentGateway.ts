import { Client } from '@infrastructure/database/entities/Client';
import { User } from '@infrastructure/database/entities/User';
import { IAccountConfiguration } from '@useCases/Users/JoinTheSystem/JoinTheSystemDTO';

export interface ICreatePlan {
	id?: string;
	title: string;
	description: string;
	amount: number;
	setupAmount: number;
	gracePeriod: number;
	frequency: string;
	interval: string;
	subscriptionDuration?: boolean | number;
}

export interface IEditPlan {
	id?: string;
	name: string;
	description: string;
	email: string;
	setupAmount: number;
	amount: number;
	gracePeriod: number;
	tolerancePeriod: number;
	frequency: string;
	interval: string;
	logo: boolean;
	currency: string;
	paymentMethods: string;
	planExpirationDate: boolean;
	hasExpiration: boolean;
	expireSubscriptions: boolean;
	subscriptionDuration: boolean;
}

// interface ICLient {
// 	name: string;
// 	email: string;
// 	cpf?: string;
// 	cnpj?: string;
// 	birth: Date;
// 	telephone: string;
// 	cellphone: string;
// }

// interface IAddress {
// 	street: string;
// 	number: number;
// 	cep: string;
// 	city: string;
// 	state: string;
// 	complement: string;
// }

interface ICard {
	owner: string;
	number: string;
	cvv: string;
	expirationMonth: string;
	expirationYear: string;
}

export interface ICreditSale {
	user: User; // | Client;
	card: ICard;
	amount: string;
	installments: number;
}

export interface ITicketSale {
	user: Client;
	amount: number;
	dueDate: Date;
	description?: string;
	interest?: number;
	lateFee?: number;
}

export interface ISignPlan {
	planId: string;
	user: User | Client;
	card: ICard;
}

export interface IGetPlanDetails {
	id: string;
}

export interface IGetSignatureDetails {
	id: string;
}

export interface IActivateSignature {
	id: string;
}

export interface ISuspendSignature {
	id: string;
}

export interface IDeleteSignature {
	id: string;
}

export interface IPaymentGateway {
	createPlan(data: ICreatePlan): Promise<number>;
	editPlan(data: IEditPlan);
	getPlanDetails(data: IGetPlanDetails);
	signPlan(data: ISignPlan, accountConfiguration: IAccountConfiguration);
	getSignatureDetails(id: string): Promise<any>;
	editSignatureDetails(data: ISignPlan);
	creditSale(data: ICreditSale);
	ticketSale(data: ITicketSale): Promise<any>;
	activateSignature(id: IActivateSignature);
	suspendSignature(id: ISuspendSignature);
	deleteSignature(id: IDeleteSignature);
}
