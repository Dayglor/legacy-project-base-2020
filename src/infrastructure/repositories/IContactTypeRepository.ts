import { ContactType } from '../database/entities/ContactType';

export interface IContactTypeRepository {
	find(options?: any): Promise<ContactType[]>;
	findById(id: string): Promise<ContactType>;
	findByReference(reference: number): Promise<ContactType>;
	findByName(name: string): Promise<ContactType>;
	save(contactType: ContactType): Promise<ContactType>;
}
