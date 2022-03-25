import { Router } from 'express';
import { autoInjectable, container, inject } from 'tsyringe';

import { ApprovePreRegisterController } from '@useCases/Users/ApprovePreRegister/ApprovePreRegisterController';
import { AuthenticateFromOutsideController } from '@useCases/Users/AuthenticateFromOutside/AuthenticateFromOutsideController';
import { ChangePasswordController } from '@useCases/Users/ChangePassword/ChangePasswordController';
import { ChangeStatusController } from '@useCases/Users/ChangeStatus/ChangeStatusController';
import { DeleteUserController } from '@useCases/Users/DeleteUser/DeleteUserController';
import { DetailsController } from '@useCases/Users/Details/DetailsController';
import { DetailsPreRegisterController } from '@useCases/Users/DetailsPreRegister/DetailsPreRegisterController';
import { EditPlanController } from '@useCases/Users/EditPlan/EditPlanController';
import { EditUserController } from '@useCases/Users/EditUser/EditUserController';
import { ForgotPasswordController } from '@useCases/Users/ForgotPassword/ForgotPasswordController';
import { GetPlanDetailsController } from '@useCases/Users/GetPlanDetails/GetPlanDetailsController';
import { GetPreRegistersController } from '@useCases/Users/GetPreRegisters/GetPreRegistersController';
import { JoinTheSystemController } from '@useCases/Users/JoinTheSystem/JoinTheSystemController';
import { ListUsersController } from '@useCases/Users/ListUsers/ListUsersController';
import { LoginController } from '@useCases/Users/Login/LoginController';
import { MyDetailsController } from '@useCases/Users/MyDetails/MyDetailsController';
import { PreRegisterUserController } from '@useCases/Users/PreRegisterUser/PreRegisterUserController';
import { ReprovePreRegisterController } from '@useCases/Users/ReprovePreRegister/ReprovePreRegisterController';
import { UserSignedController } from '@useCases/Users/UserSigned/UserSignedController';

import { ACL } from '../ACL';
import { Authenticate } from '../Authenticate';

@autoInjectable()
export class UsersRoutes {
	constructor(
		@inject('Router') private readonly router: Router,
		@inject('Authenticate') private readonly auth: Authenticate,
		@inject('ACL') private readonly acl: ACL
	) {
		this.router.post('/login', (request, response) => {
			return container.resolve(LoginController).handle(request, response);
		});

		this.router.post('/users', (request, response) => {
			return container.resolve(PreRegisterUserController).handle(request, response);
		});

		this.router.put('/users/:id', auth.authenticate, (request, response) => {
			return container.resolve(EditUserController).handle(request, response);
		});

		this.router.get('/users', (request, response) => {
			return container.resolve(ListUsersController).handle(request, response);
		});

		this.router.get('/users/me', auth.authenticate, (request, response) => {
			return container.resolve(MyDetailsController).handle(request, response);
		});

		this.router.get('/users/signed', auth.authenticate, (request, response) => {
			return container.resolve(UserSignedController).handle(request, response);
		});

		this.router.post('/users/join', auth.authenticate, (request, response) => {
			return container.resolve(JoinTheSystemController).handle(request, response);
		});

		this.router.post('/users/change-password', auth.authenticate, (request, response) => {
			return container.resolve(ChangePasswordController).handle(request, response);
		});

		this.router.post('/users/forgot-password', (request, response) => {
			return container.resolve(ForgotPasswordController).handle(request, response);
		});

		this.router.get('/users/pre-register', auth.authenticate, (request, response) => {
			return container.resolve(GetPreRegistersController).handle(request, response);
		});

		this.router.get('/users/pre-register/:userId', auth.authenticate, (request, response) => {
			return container.resolve(DetailsPreRegisterController).handle(request, response);
		});

		this.router.post('/users/reprove-pre-register', auth.authenticate, (request, response) => {
			return container.resolve(ReprovePreRegisterController).handle(request, response);
		});

		this.router.post('/users/approve-pre-register', auth.authenticate, (request, response) => {
			return container.resolve(ApprovePreRegisterController).handle(request, response);
		});

		this.router.post('/users/authenticate', (request, response) => {
			return container.resolve(AuthenticateFromOutsideController).handle(request, response);
		});

		this.router.get('/users/details/:id', auth.authenticate, (request, response) => {
			return container.resolve(DetailsController).handle(request, response);
		});

		this.router.put('/users/change-status/:id', auth.authenticate, (request, response) => {
			return container.resolve(ChangeStatusController).handle(request, response);
		});

		this.router.get('/users/account-configurations/:id', auth.authenticate, (request, response) => {
			return container.resolve(GetPlanDetailsController).handle(request, response);
		});

		this.router.put('/users/edit-plan/:id', auth.authenticate, (request, response) => {
			return container.resolve(EditPlanController).handle(request, response);
		});

		this.router.delete('/users/:id', (request, response) => {
			return container.resolve(DeleteUserController).handle(request, response);
		});
	}
}
