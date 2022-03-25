import { container } from 'tsyringe';

import { GetMenusUseCase } from './GetMenusUseCase';

describe('Get system menus', () => {
	it('should return the menus', async () => {
		const getMenusUseCase = container.resolve(GetMenusUseCase);
		const menus = await getMenusUseCase.execute();

		expect(menus.length).toBeGreaterThan(0);
	});
});
