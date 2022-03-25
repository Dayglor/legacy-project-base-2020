import { container } from 'tsyringe';

import { PostMenusUseCase } from './PostMenusUseCase';
import '@tests/beforeAll';

it('should register menu and a child menu', async () => {
	const useCase = container.resolve(PostMenusUseCase);

	const menu = await useCase.execute({
		title: 'Menu role',
		url: 'teste/teste1',
	});

	expect(menu.title).toEqual('Menu role');

	const menuChild = await useCase.execute({
		parent: menu.id,
		title: 'Menu Role Child',
		url: 'teste/teste2',
	});

	expect(menuChild.parent.id).toEqual(menu.id);
	expect(menuChild.url).toEqual('teste/teste2');
}, 10000);
