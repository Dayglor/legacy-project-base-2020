import { Address } from '@domain/Address';
import { Contact } from '@domain/Contact';

export interface IEditUserDTO {
	userId: string;
	email: string;
	nationalRegistration: string;
	tradingName: string;
	companyName?: string;
	gender: string;
	birthDate: string;
	commision?: number;
	revenues?: string;
	userBank: any;
	bank: any;
	address: Address;
	contacts: Contact[];
}
