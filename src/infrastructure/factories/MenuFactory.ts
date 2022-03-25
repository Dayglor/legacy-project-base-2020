import { autoInjectable, inject } from 'tsyringe';

import { Menu } from '@infrastructure/database/entities/Menu';
import { IMenuRepository } from '@infrastructure/repositories/IMenuRepository';
import { IPostMenusDTO } from '@useCases/Menus/PostMenus/PostMenusDTO';

@autoInjectable()
export class MenuFactory {
	constructor(@inject('IMenuRepository') private readonly menuRepository: IMenuRepository) {}

	async RegisterMenuDTO(data: IPostMenusDTO): Promise<Menu> {
		const { title, url, parent } = data;

		const menu = new Menu();

		menu.title = title;
		menu.url = url;

		const menuParent = await this.menuRepository.findById(parent);

		menu.parent = menuParent;

		return menu;
	}
}
