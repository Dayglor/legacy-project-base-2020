import { Address } from '@domain/Address';
import { Contact } from '@domain/Contact';

export interface IRegisterClientDTO {
	userId: string;
	tradingName: string;
	companyName?: string;
	email: string;
	nationalRegistration: string;
	gender?: string;
	birthDate: string;
	note?: string;

	address: Address;
	contacts: Contact[];
}
