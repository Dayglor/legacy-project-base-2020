export interface IGatewayDTO {
	privateKey?: string;
	token?: string;
}

export interface IEditPlanDTO {
	id: string;
	amount: number;
	freeQuery: number;
	freeInvoice: number;
	freeProductInvoice: number;
	gateway?: IGatewayDTO;
}
