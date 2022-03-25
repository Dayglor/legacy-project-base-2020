import { Router } from 'express';
import { container } from 'tsyringe';

import { ActionsRoutes } from '@infrastructure/http/routes/ActionsRoutes';
import { BanksRoutes } from '@infrastructure/http/routes/BanksRoutes';
import { ClientsRoutes } from '@infrastructure/http/routes/ClientsRoutes';
import { CNPJRoutes } from '@infrastructure/http/routes/CNPJRoutes';
import { CompaniesRoutes } from '@infrastructure/http/routes/CompaniesRoutes';
import { CPFRoutes } from '@infrastructure/http/routes/CPFRoutes';
import { MainRoutes } from '@infrastructure/http/routes/MainRoutes';
import { MenusRoutes } from '@infrastructure/http/routes/MenusRoutes';
import { PaymentsRoutes } from '@infrastructure/http/routes/PaymentsRoutes';
import { ProductCategoryRoutes } from '@infrastructure/http/routes/ProductCategoryRoutes';
import { ProductsRoutes } from '@infrastructure/http/routes/ProductsRoutes';
import { RolesRoutes } from '@infrastructure/http/routes/RolesRoutes';
import { SalesRoutes } from '@infrastructure/http/routes/SalesRoutes';
import { UsersRoutes } from '@infrastructure/http/routes/UsersRoutes';
import { WebhooksRoutes } from '@infrastructure/http/routes/WebhooksRoutes';

export class RoutesProvider {
	async register(): Promise<void> {
		container.register('Router', { useValue: Router() });

		container.resolve(MainRoutes);
		container.resolve(BanksRoutes);
		container.resolve(ActionsRoutes);
		container.resolve(ClientsRoutes);
		container.resolve(CPFRoutes);
		container.resolve(CNPJRoutes);
		container.resolve(CompaniesRoutes);
		container.resolve(MenusRoutes);
		container.resolve(PaymentsRoutes);
		container.resolve(ProductCategoryRoutes);
		container.resolve(ProductsRoutes);
		container.resolve(RolesRoutes);
		container.resolve(SalesRoutes);
		container.resolve(UsersRoutes);
		container.resolve(WebhooksRoutes);
	}
}
