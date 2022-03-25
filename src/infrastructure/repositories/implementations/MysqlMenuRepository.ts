import { autoInjectable, inject } from 'tsyringe';
import { Connection, Repository } from 'typeorm';

import { Utils } from '@infrastructure/utils';
import { IGetMenusDTO } from '@useCases/Menus/GetMenus/GetMenusDTO';

import { Menu } from '../../database/entities/Menu';
import { IMenuRepository } from '../IMenuRepository';
import { IRoleRepository } from '../IRoleRepository';

@autoInjectable()
export class MysqlMenuRepository implements IMenuRepository {
	private readonly menuClient: Repository<Menu>;

	constructor(
		@inject('MysqlClient') private readonly mysqlClient: Connection,
		@inject('IRoleRepository') private readonly roleRepository: IRoleRepository
	) {
		this.menuClient = this.mysqlClient.getRepository(Menu);
	}
	async find(options: IGetMenusDTO, where: any): Promise<Menu[]> {
		const { limit, page, order } = options;
		const skip = (+page - 1) * +limit;

		const dataFind = {
			where,
			skip,
			take: limit,
			order: null,
		};

		if (order?.direction && order?.field) {
			dataFind.order = { [order.field]: order.direction };
		}

		const menus = await this.menuClient.find(dataFind);

		await Utils.forEachAsync(menus, async (menu: Menu, key: number) => {
			const childs = await this.menuClient.find({
				where: {
					parent: menu.id,
				},
				order: dataFind.order,
			});

			menus[key].child = childs;
		});

		return menus;
	}

	async findById(id: string): Promise<Menu> {
		const menu = await this.menuClient.findOne({ id });

		return menu;
	}

	async findByRole(roleId: string): Promise<Menu[]> {
		const role = await this.roleRepository.findById(roleId);

		if (!role) {
			return [];
		}

		// if (role.name === 'Administrador') {
		// 	return this.menuClient
		// 		.createQueryBuilder('menu')
		// 		.leftJoinAndSelect('menu.parent', 'parent')
		// 		.innerJoinAndSelect('menu.action', 'action')
		// 		.getMany();
		// }

		const menus = await this.menuClient
			.createQueryBuilder('menu')
			.leftJoinAndSelect('menu.parent', 'parent')
			.innerJoinAndSelect('menu.action', 'action')
			.innerJoinAndSelect('action.roles', 'roles', 'roles.id = :roleId', { roleId })
			.getMany();

		return menus;
	}

	async save(menu: Menu): Promise<Menu> {
		const newMenu = await this.menuClient.save(menu);

		return newMenu;
	}

	async findByTitleAndUrl(title: string, url: string): Promise<Menu> {
		const menu = await this.menuClient.findOne({ title, url });

		return menu;
	}

	async findByUrl(url: string): Promise<Menu> {
		const menu = await this.menuClient.findOne({ url });

		return menu;
	}
}
