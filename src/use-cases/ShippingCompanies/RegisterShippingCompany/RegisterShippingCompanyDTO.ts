import { Address } from '@domain/Address';
import { Contact } from '@domain/Contact';

export interface IRegisterShippingCompanyDTO {
	tradingName: string;
	companyName: string;
	nationalRegistration: string;
	email: string;
	note?: string;
	userId: string;

	address: Address;

	contacts: Contact[];
}
