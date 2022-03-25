import { autoInjectable, inject } from 'tsyringe';

import { Address } from '@infrastructure/database/entities/Address';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';

export interface IRegisterAddressDTO {
	street: string;
	number: number;
	complement?: string;
	city: string;
	state: string;
	neighborhood: string;
	postalCode: string;
	country: string;
	district?: string;
}

@autoInjectable()
export class AddressFactory {
	constructor(@inject('IAddressRepository') private readonly addressRepository: IAddressRepository) {}

	async makeFromRegisterAddressDTO(data: IRegisterAddressDTO): Promise<Address> {
		const newAddress = new Address();
		Object.assign(newAddress, data);
		newAddress.postal_code = data?.postalCode.replace(/\D/g, '');
		// newAddress.neighborhood = data.district;
		// console.log(data);
		return newAddress;
	}

	async makeFromEditAddressDTO(data: IRegisterAddressDTO, address: Address): Promise<Address> {
		Object.assign(address, data);
		address.postal_code = data?.postalCode.replace(/\D/g, '');

		return address;
	}
}
