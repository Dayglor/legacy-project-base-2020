import { container } from 'tsyringe';

import { AccountConfigurationFactory } from '@infrastructure/factories/AccountConfigurationFactory';
import { CardFactory } from '@infrastructure/factories/CardFactory';
import { CompanyFactory } from '@infrastructure/factories/CompanyFactory';
import { PaymentCardFactory } from '@infrastructure/factories/PaymentCardFactory';
import { ReceivableFactory } from '@infrastructure/factories/ReceivableFactory';
import { SaleCommissionFactory } from '@infrastructure/factories/SaleCommissionFactory';
import { SaleFactory } from '@infrastructure/factories/SaleFactory';
import { UserQueryFactory } from '@infrastructure/factories/UserQueryFactory';

import { ClientFactory } from '../factories/ClientFactory';
import { MenuFactory } from '../factories/MenuFactory';
import { ProductFactory } from '../factories/ProductFactory';
import { RoleFactory } from '../factories/RoleFactory';
import { UserBankFactory } from '../factories/UserBankFactory';
import { WebhookFactory } from '../factories/WebhookFactory';

export class FactoriesProvider {
	async register(): Promise<void> {
		container.resolve(CompanyFactory);
		container.resolve(RoleFactory);
		container.resolve(MenuFactory);
		container.resolve(ClientFactory);
		container.resolve(ProductFactory);
		container.resolve(AccountConfigurationFactory);
		container.resolve(SaleFactory);
		container.resolve(SaleCommissionFactory);
		container.resolve(UserQueryFactory);
		container.resolve(PaymentCardFactory);
		container.resolve(CardFactory);
		container.resolve(ReceivableFactory);
		container.resolve(UserBankFactory);
		container.resolve(WebhookFactory);
	}
}
