import { autoInjectable } from 'tsyringe';

// import { Holder } from '@infrastructure/database/entities/Holder';
// import { ZoopClient } from '@infrastructure/external-providers/crm-consultores-gateways/zoop/client/ZoopClient';
import { RabbitMQClient } from '@infrastructure/external-providers/rabbit-mq/implementations/RabbitMQClient';
// import { IHolderRepository } from '@infrastructure/repositories/IHolderRepository';
// import { IMarketplaceRepository } from '@infrastructure/repositories/IMarketplaceRepository';

import { IMessagesConsumer } from '../IMessagesConsumer';

@autoInjectable()
export class ImportHoldersFromMarketplace implements IMessagesConsumer {
	constructor(
		private readonly rabbitMQClient: RabbitMQClient // @inject('IMarketplaceRepository') private readonly marketplaceRepository: IMarketplaceRepository, // @inject('IHolderRepository') private readonly holderRepository: IHolderRepository
	) {}
	private async getHoldersByMarketplace(): Promise<void> {
		// const { holders, pagination } = await zoopClient.getHoldersByMarketplace({
		// 	page,
		// 	limit,
		// });
		// await Utils.forEachAsync(holders, async (holder: any): Promise<void> => {
		// 	try {
		// 		const holderExists = await this.holderRepository.findByNationalRegistration(holder.national_registration);
		// 		if (holderExists) {
		// 			throw new Error(`Holder with national registration (${holder.national_registration}) already exists`);
		// 		}
		// 		const newHolder = new Holder();
		// 		newHolder.marketplace = <any>marketplaceId;
		// 		newHolder.externalId = holder.id;
		// 		newHolder.name = holder.name;
		// 		newHolder.nationalRegistration = holder.national_registration;
		// 		newHolder.email = holder.email;
		// 		newHolder.status = holder.status;
		// 		const result = await this.holderRepository.save(newHolder);
		// 		this.rabbitMQClient.add('ImportAddressesFromHolder', { holderId: result.id });
		// 		this.rabbitMQClient.add('ImportContactsFromHolder', { holderId: result.id });
		// 		this.rabbitMQClient.add('ImportDocumentsFromHolder', { holderId: result.id });
		// 		this.rabbitMQClient.add('ImportPrePaidCardsFromHolder', { holderId: result.id });
		// 		this.rabbitMQClient.add('ImportAccountsFromHolder', { holderId: result.id });
		// 	} catch (error) {
		// 		console.log(error.message);
		// 	}
		// });
		// if (allPages && page < pagination.total_pages) {
		// 	await this.getHoldersByMarketplace({ marketplaceId, zoopClient, page: page + 1, limit });
		// }
	}
	async execute(): Promise<boolean> {
		try {
			// const { marketplaceId, limit, allPages } = data;

			// if (!marketplaceId) {
			// 	throw new Error('marketplaceId should not be empty.');
			// }

			// const { publishableKey, zoopMarketplaceId } = await this.marketplaceRepository.getCredentials(marketplaceId);

			// const zoopClient: ZoopClient = new ZoopClient({ publishableKey, zoopMarketplaceId });

			// await this.getHoldersByMarketplace({ marketplaceId, zoopClient, limit: limit || 20, allPages: allPages ?? true });

			return true;
		} catch (error) {
			console.log(error.message);
			return false;
		}
	}
}
