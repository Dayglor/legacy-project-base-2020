import { validate } from 'class-validator';
import { autoInjectable, inject } from 'tsyringe';

import { Menu } from '@infrastructure/database/entities/Menu';
import { EnhancedError } from '@infrastructure/errors/EnhancedError';
import { MenuFactory } from '@infrastructure/factories/MenuFactory';
import { IMenuRepository } from '@infrastructure/repositories/IMenuRepository';

import { IPostMenusDTO } from './PostMenusDTO';

@autoInjectable()
export class PostMenusUseCase {
	// constructor(
	// 	@inject('IMenuRepository') private readonly menuRepository: IMenuRepository // private readonly menuFactory: MenuFactory
	// ) {}

	constructor(
		@inject('IMenuRepository') private readonly menuRepository: IMenuRepository,
		private readonly menuFactory: MenuFactory
	) {}

	async execute(data: IPostMenusDTO): Promise<Menu> {
		const newMenu = await this.menuFactory.RegisterMenuDTO(data);
		const errors = await validate(newMenu);

		if (errors.length > 0) {
			throw new EnhancedError(
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
					.toString(),
				{}
			);
		}

		const menu = await this.menuRepository.save(newMenu);

		return menu;
	}
}
