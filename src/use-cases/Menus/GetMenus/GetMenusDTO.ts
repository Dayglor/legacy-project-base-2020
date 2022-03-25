export interface IOrderGetMenusDTO {
	field: string;
	direction: string;
}

export interface IGetMenusDTO {
	limit?: number;
	page?: number;
	order?: IOrderGetMenusDTO;
}
