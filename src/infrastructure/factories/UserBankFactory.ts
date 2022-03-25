import { autoInjectable, inject } from 'tsyringe';

import { User } from '@infrastructure/database/entities/User';
import { UserBank } from '@infrastructure/database/entities/UserBank';
import { IUserBankRepository } from '@infrastructure/repositories/IUserBankRepository';

export interface IRegisterContactDTO {
	contactTypeId: string;
	name: string;
	contact: string;
}

export interface IRegisterUserBank {
	bank: string;
	// digit: string;
	accountNumber: string;
	agency: string;
	accountType: string;
	user?: User;
}

@autoInjectable()
export class UserBankFactory {
	constructor(@inject('IUserBankRepository') private readonly userBankRepository: IUserBankRepository) {}
	async makeFromRegisterUserBank(data: IRegisterUserBank): Promise<UserBank> {
		// const { contacts, contactLinkId } = data;

		// const cellphoneContactType = await this.userBankRepository.findByName('Celular');

		// const newContacts: UserBank[] = [];
		// contacts.forEach((contact: any) => {
		// 	if (contact.contact) {
		// 		// 	return false;
		// 		// }
		const newBank = new UserBank();
		Object.assign(newBank, data);
		newBank.agency = data.agency;
		newBank.account_number = data.accountNumber;
		// newBank.digit = data.digit;
		newBank.bank = <any>data.bank;
		newBank.type = data.accountType;
		// newBanks.push(newBank);
		// 	}
		// });

		return newBank;
	}

	async makeFromEditUserBankDTO(data: any, userBank: UserBank): Promise<UserBank> {
		// const { digit, accountNumber, agency, type, bank } = data;
		const { accountNumber, agency, type, bank } = data;

		// userBank.digit = digit;
		userBank.account_number = accountNumber;
		userBank.agency = agency;
		userBank.type = type;
		userBank.bank = bank.id;

		return userBank;
	}
}
