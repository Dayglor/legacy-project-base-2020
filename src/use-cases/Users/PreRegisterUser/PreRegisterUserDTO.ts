import { Address } from '@domain/Address';
import { Contact } from '@domain/Contact';
import { Document } from '@domain/Document';
import { User } from '@infrastructure/database/entities/User';
// import { UserBank } from '@infrastructure/database/entities/UserBank';
import { IPreRegisterMajorityMemberDTO } from '@infrastructure/factories/MajorityMemberFactory';

export interface IUserBankAccount {
	accountNumber: string;
	// digit: string;
	accountType: string;
	agency: string;
	bank: string;
	user?: User;
}

export interface IPreRegisterUserDTO {
	email: string;
	nationalRegistration: string;
	password?: string;
	tradingName: string;
	companyName?: string;
	gender: string;
	birthDate: string;
	revenues?: number;
	commision?: number;
	logo?:any;
	comprovanteEndereco?:any;
	cnh?:any;
	contratoSocial?:any;

	majorityMember?: IPreRegisterMajorityMemberDTO;

	address: Address;

	contacts: Contact[];
	documents?: Document[];
	userBankAccount: IUserBankAccount;
}
