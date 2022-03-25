import { autoInjectable, inject } from 'tsyringe';

import { ISaleRepository } from '@infrastructure/repositories/ISaleRepository';

@autoInjectable()
export class DeleteSaleUseCase {
	constructor(@inject('ISaleRepository') private readonly saleRepository: ISaleRepository) {}

	async execute(id: string): Promise<void> {
		await this.saleRepository.delete(id);
	}
}
