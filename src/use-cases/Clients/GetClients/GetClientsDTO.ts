export interface IGetClientsDTO {
	userId?: string;
	parentId?: string;
	limit?: number;
	page?: number;
	searchByEmail?: string;
	searchByTradingName?: string;
	searchByDocument?: string;
	nationalRegistration?: string;
}
