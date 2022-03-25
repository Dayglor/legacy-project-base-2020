export interface IRegisterProductDTO {
	name: string;
	productCode: string;
	categoryId: string;
	userId: string;
	sku: string;
	stock: any;
	costPrice: string;
	salePrice: string;
	stock: string;
	stockQuantity: number;
	ICMSPercentage: number;
	ICMSValue: number;
	IPIPercentage: number;
	IPIValue: number;
	PISPercentage: number;
	PISValue: number;
	COFINSPercentage: number;
	COFINSValue: number;
}
