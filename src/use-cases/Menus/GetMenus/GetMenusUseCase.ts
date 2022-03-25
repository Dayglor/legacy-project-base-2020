import { autoInjectable, inject } from 'tsyringe';
import { IsNull } from 'typeorm';

import { Menu } from '@infrastructure/database/entities/Menu';

import { IMenuRepository } from '../../../infrastructure/repositories/IMenuRepository';
import { IGetMenusDTO } from './GetMenusDTO';

@autoInjectable()
export class GetMenusUseCase {
	constructor(@inject('IMenuRepository') private readonly menuRepository: IMenuRepository) {}

	async execute(filter?: IGetMenusDTO): Promise<Menu[]> {
		const { limit, page } = filter || {};
		const where = {
			parent: IsNull(),
		};
		const menus = await this.menuRepository.find(
			{
				limit,
				page,
				order: {
					field: 'title',
					direction: 'ASC',
				},
			},
			where
		);

		return menus;
	}
}
