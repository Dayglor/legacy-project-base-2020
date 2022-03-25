export interface IJoinTheSystemDTO {
	owner: string;
	number: string;
	expirationMonth: string;
	expirationYear: string;
	cvv: string;
	ownerDocument: string;
	gatewayId?: string;
	userId?: string;
	planId?: string;
}

export interface IAccountConfiguration {
	id: string;
	freeDays: number;
	amount: number;
	setupAmount: number;
	freeInvoices: number;
	freeQuery: number;
	freeProductInvoice: number;
	externalPlanId?: string;
	externalSignatureId?: string;
	gatewayId: string;
	userId: string;
	token: string;
	privateKey: string;
}
