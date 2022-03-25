import { IGetMenusDTO } from '@useCases/Menus/GetMenus/GetMenusDTO';

import { Menu } from '../database/entities/Menu';

export interface IMenuRepository {
	find(options?: IGetMenusDTO, where?: any): Promise<Menu[]>;
	findById(id: string): Promise<Menu>;
	findByTitleAndUrl(title: string, url: string): Promise<Menu>;
	findByUrl(url: string): Promise<Menu>;
	findByRole(roleId: string): Promise<Menu[]>;
	save(menu: Menu): Promise<Menu>;
}
