import { Role } from '../database/entities/Role';

export interface IRoleRepository {
	find(options?: any): Promise<Role[]>;
	findById(id: string): Promise<Role>;
	findByName(name: string): Promise<Role>;
	save(role: Role): Promise<Role>;
	delete(id: string): Promise<boolean>;
}
