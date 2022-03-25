export interface IGetProductsDTO {
	limit?: number;
	page?: number;
	searchByName?: string;
	userId?: string;
	parentId?: string;
}
