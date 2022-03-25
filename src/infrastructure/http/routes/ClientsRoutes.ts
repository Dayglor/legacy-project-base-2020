import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { DeleteClientController } from '@useCases/Clients/DeleteClient/DeleteClientController';
import { EditClientController } from '@useCases/Clients/EditClient/EditClientController';
import { GetBirthdaysController } from '@useCases/Clients/GetBirthdays/GetBirthdaysController';
import { GetClientController } from '@useCases/Clients/GetClient/GetClientController';
import { GetClientsController } from '@useCases/Clients/GetClients/GetClientsController';
import { RegisterClientController } from '@useCases/Clients/RegisterClient/RegisterClientController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class ClientsRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get('/clients/birthdays', auth.authenticate, (request, response) => {
			return container.resolve(GetBirthdaysController).handle(request, response);
		});

		this.router.get(
			'/clients/:id',
			auth.authenticate,
			// acl.canAccessAction('get-client-by-id'),
			(request, response) => {
				return container.resolve(GetClientController).handle(request, response);
			}
		);

		this.router.put(
			'/clients/:id',
			auth.authenticate,
			// acl.canAccessAction('edit-client-by-id'),
			(request, response) => {
				return container.resolve(EditClientController).handle(request, response);
			}
		);

		this.router.get(
			'/clients',
			auth.authenticate,
			// acl.canAccessAction('get-clients'),
			(request, response) => {
				return container.resolve(GetClientsController).handle(request, response);
			}
		);

		this.router.post(
			'/clients',
			auth.authenticate,
			// acl.canAccessAction('register-client'),
			(request, response) => {
				return container.resolve(RegisterClientController).handle(request, response);
			}
		);

		this.router.delete(
			'/clients/:id',
			auth.authenticate,
			// acl.canAccessAction('delete-client-by-id'),
			(request, response) => {
				return container.resolve(DeleteClientController).handle(request, response);
			}
		);
	}
}
