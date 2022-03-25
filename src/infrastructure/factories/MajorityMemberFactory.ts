import parseISO from 'date-fns/parseISO';
import { autoInjectable } from 'tsyringe';

import { Address } from '@domain/Address';
import { Contact } from '@domain/Contact';
import { Document } from '@domain/Document';
import { MajorityMember } from '@infrastructure/database/entities/MajorityMember';

export interface IPreRegisterMajorityMemberDTO {
	tradingName: string;
	companyName?: string;
	nationalRegistration: string;
	email: string;
	birthDate: string;
	address: Address;
	contacts: Contact[];
	documents?: Document[];
}

@autoInjectable()
export class MajorityMemberFactory {
	makeFromPreRegisterMajorityMemberDTO(data: IPreRegisterMajorityMemberDTO): MajorityMember {
		const { tradingName, companyName, nationalRegistration, email, birthDate } = data;

		const majorityMember = new MajorityMember();

		majorityMember.email = email;
		majorityMember.national_registration = nationalRegistration.replace(/[^\d]/g, '');
		majorityMember.trading_name = tradingName;
		majorityMember.company_name = companyName;
		majorityMember.birth_date = parseISO(birthDate);

		return majorityMember;
	}
}
