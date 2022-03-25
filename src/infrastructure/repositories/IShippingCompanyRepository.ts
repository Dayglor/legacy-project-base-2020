import { ShippingCompany } from '@infrastructure/database/entities/ShippingCompany';
import { IGetShippingCompaniesDTO } from '@useCases/ShippingCompanies/GetShippingCompanies/GetShippingCompaniesDTO';

export interface IShippingCompanyRepository {
	find(options: IGetShippingCompaniesDTO): Promise<ShippingCompany[]>;
	findById(id: string): Promise<ShippingCompany>;
	save(shippingCompany: ShippingCompany): Promise<ShippingCompany>;
	delete(id: string): Promise<void>;
}
