import { AccountConfiguration } from '@infrastructure/database/entities/AccountConfiguration';

export interface IAccountConfigurationRepository {
	save(AccountConfiguration): Promise<AccountConfiguration>;
	findById(id: string): Promise<AccountConfiguration>;
	findByUserId(id: string): Promise<AccountConfiguration>;
	find(options?: any): Promise<AccountConfiguration[]>;
}
