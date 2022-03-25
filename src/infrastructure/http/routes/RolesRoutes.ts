import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { DeleteRoleController } from '@useCases/Roles/DeleteRole/DeleteRoleController';
import { EditRoleController } from '@useCases/Roles/EditRole/EditRoleController';
import { GetActionsByRoleController } from '@useCases/Roles/GetActionsByRole/GetActionsByRoleController';
import { GetMenusByRoleController } from '@useCases/Roles/GetMenusByRole/GetMenusByRoleController';
import { GetRoleController } from '@useCases/Roles/GetRole/GetRoleController';
import { GetRolesController } from '@useCases/Roles/GetRoles/GetRolesController';
import { RegisterRoleController } from '@useCases/Roles/RegisterRole/RegisterRoleController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class RolesRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.get('/roles', auth.authenticate, acl.canAccessAction('getRoles'), (request, response) => {
			return container.resolve(GetRolesController).handle(request, response);
		});

		this.router.get(
			'/roles/:id/actions',
			auth.authenticate,
			acl.canAccessAction('getActionsByRole'),
			(request, response) => {
				return container.resolve(GetActionsByRoleController).handle(request, response);
			}
		);

		this.router.get(
			'/roles/:id/menus',
			auth.authenticate,
			acl.canAccessAction('getMenusByRole'),
			(request, response) => {
				return container.resolve(GetMenusByRoleController).handle(request, response);
			}
		);

		this.router.get('/roles/:id', auth.authenticate, acl.canAccessAction('getRole'), (request, response) => {
			return container.resolve(GetRoleController).handle(request, response);
		});

		this.router.post('/roles', auth.authenticate, acl.canAccessAction('registerRoles'), (request, response) => {
			return container.resolve(RegisterRoleController).handle(request, response);
		});

		this.router.put('/roles/:id', auth.authenticate, acl.canAccessAction('editRoles'), (request, response) => {
			return container.resolve(EditRoleController).handle(request, response);
		});

		this.router.delete('/roles/:id', auth.authenticate, acl.canAccessAction('deleteRoles'), (request, response) => {
			return container.resolve(DeleteRoleController).handle(request, response);
		});
	}
}
