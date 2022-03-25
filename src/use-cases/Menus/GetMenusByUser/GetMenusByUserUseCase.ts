import { autoInjectable, inject } from 'tsyringe';

import { Utils } from '@infrastructure/utils';

import { IMenuRepository } from '../../../infrastructure/repositories/IMenuRepository';

@autoInjectable()
export class GetMenusByUserUseCase {
	constructor(@inject('IMenuRepository') private readonly menuRepository: IMenuRepository) {}

	async execute(roleId: string): Promise<any[]> {
		// console.log(roleId);
		const menus = await this.menuRepository.findByRole(roleId);

		const result = menus
			.filter((m) => !m.parent)
			.reduce((r, v) => {
				if (!Utils.isset(() => r[v.id])) {
					r[v.id] = {
						id: v.id,
						title: v.title,
						url: v.url,
						action: v.action.name,
						children: [],
						icon: v.icon,
					};
				}

				return r;
			}, {});

		menus
			.filter((m) => m.parent)
			.forEach((v) => {
				result[v.parent.id]?.children.push({
					id: v.id,
					title: v.title,
					url: v.url,
					action: v.action.name,
				});
			});

		return Object.values(result);
	}
}
