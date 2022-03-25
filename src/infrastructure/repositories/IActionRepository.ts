import { Action } from '@infrastructure/database/entities/Action';

export interface IActionRepository {
	save(action: Action): Promise<Action>;
	find(options: any): Promise<Action[]>;
	findById(id: string): Promise<Action>;
	findByName(name: string): Promise<Action>;
	findByRole(roleId: string): Promise<Action[]>;
	findByRoleAndAction(roleId: string, actionName: string): Promise<Action>;
}
