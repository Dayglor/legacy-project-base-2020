import { autoInjectable, inject } from 'tsyringe';

import { Menu } from '@infrastructure/database/entities/Menu';
import { IMenuRepository } from '@infrastructure/repositories/IMenuRepository';

@autoInjectable()
export class GetMenusByRoleUseCase {
	constructor(@inject('IMenuRepository') private readonly menuRepository: IMenuRepository) {}

	async execute(roleId: string): Promise<Menu[]> {
		const menus = this.menuRepository.findByRole(roleId);

		return menus;
	}
}
