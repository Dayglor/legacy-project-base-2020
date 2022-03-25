import { container } from 'tsyringe';

import { ACL } from '@infrastructure/http/ACL';
import { Authenticate } from '@infrastructure/http/Authenticate';

export class AuthProvider {
	async register(): Promise<void> {
		container.register('Authenticate', { useValue: container.resolve(Authenticate) });
		container.register('ACL', { useValue: container.resolve(ACL) });
	}
}
