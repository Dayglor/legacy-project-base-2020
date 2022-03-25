export interface IApprovePreRegisterAccountConfigurations {
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
}

export interface IGatewayApprovePreRegister {
	token?: string;
	privateKey?: string;
}

export interface IApprovePreRegisterDTO {
	id: string;
	accountConfig: IApprovePreRegisterAccountConfigurations;
	gateway: IGatewayApprovePreRegister;
}
