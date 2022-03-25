import { container } from 'tsyringe';

import { GetMenusByUserUseCase } from './GetMenusByUserUseCase';

describe('Get system menus by user', () => {
	it('should return the menus that a user can view', async () => {
		const getMenusByUserUseCase = container.resolve(GetMenusByUserUseCase);

		const menus = await getMenusByUserUseCase.execute();

		expect(menus.length).toBeGreaterThan(0);
	});
});
