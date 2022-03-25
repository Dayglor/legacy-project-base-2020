import { container } from 'tsyringe';

import { RegisterActionUseCase } from '@useCases/Actions/RegisterAction/RegisterActionUseCase';

it('should register an action', async () => {
	const useCase = container.resolve(RegisterActionUseCase);

	const action = await useCase.execute({
		name: 'Teste',
	});

	expect(action.name).toEqual('Teste');

	const action2 = await useCase.execute({
		name: 'Teste Parent',
		parentId: action.id,
	});

	expect(action2.parent.id).toEqual(action.id);
	expect(action2.name).toEqual('Teste Parent');
});
