import 'reflect-metadata';

import crypto from 'crypto';
import { autoInjectable, container, inject } from 'tsyringe';
import { Connection } from 'typeorm';

import { Action } from '@infrastructure/database/entities/Action';
import { Bank } from '@infrastructure/database/entities/Bank';
import { Menu } from '@infrastructure/database/entities/Menu';
import { PaymentType } from '@infrastructure/database/entities/PaymentType';
import { Role } from '@infrastructure/database/entities/Role';
import { SaleType } from '@infrastructure/database/entities/SaleType';
import { User } from '@infrastructure/database/entities/User';
import { IActionRepository } from '@infrastructure/repositories/IActionRepository';
import { IBankRepository } from '@infrastructure/repositories/IBankRepository';
import { IMenuRepository } from '@infrastructure/repositories/IMenuRepository';
import { IPaymentTypeRepository } from '@infrastructure/repositories/IPaymentTypeRepository';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';
import { ISaleTypeRepository } from '@infrastructure/repositories/ISaleTypeRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';

import { init } from '../bootstrap';
import setupData from './setup-data';

@autoInjectable()
export class Setup {
	constructor(
		@inject('MysqlClient') private readonly mysqlClient: Connection,
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
		@inject('IBankRepository') private readonly bankRepository: IBankRepository,
		@inject('IActionRepository') private readonly actionRepository: IActionRepository,
		@inject('ISaleTypeRepository') private readonly saleTypeRepository: ISaleTypeRepository,
		@inject('IPaymentTypeRepository') private readonly paymentTypeRepository: IPaymentTypeRepository,
		@inject('IMenuRepository') private readonly menuRepository: IMenuRepository
	) {}

	async initialize(): Promise<void> {
		await this.registerRoles();
		await this.registerBanks();
		await this.registerUsers();
		await this.registerActions();
		await this.registerSalesTypes();
		await this.registerPaymentsTypes();
		await this.registerRoleActions();
		await this.registerMenus();
		// await this.registerProduct();
	}

	private async registerRoles(): Promise<void> {
		console.log(`*** Register Roles ***\n`);
		const { roles } = setupData;
		await Utils.forEachAsync(roles, async (role: string): Promise<void> => {
			try {
				const roleExists = await this.roleRepository.findByName(role);

				if (roleExists) {
					throw new Error(`${role} already exists.`);
				}

				const newRole = new Role();
				newRole.name = role;
				await this.roleRepository.save(newRole);

				console.log(`${role} registered.`);
			} catch (error) {
				console.log(error.message);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}

	private async registerBanks(): Promise<void> {
		console.log(`*** Register Banks ***\n`);
		const { banks } = setupData;
		await Utils.forEachAsync(banks, async (currentBank: any): Promise<void> => {
			try {
				const bankExists = await this.bankRepository.find({
					// where: {
					name: currentBank.name,
					// },
				});

				if (bankExists.length > 0) {
					throw new Error(`${bankExists[0].id} - ${bankExists[0].name} already exists.`);
				}

				const bank = new Bank();
				bank.name = currentBank.name;
				bank.cod = currentBank.cod;
				bank.priority = currentBank.priority;
				await this.bankRepository.save(bank);

				console.log(`${bank.name} registered.`);
			} catch (error) {
				console.log(error.message);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}

	private async registerUsers(): Promise<void> {
		console.log(`*** Register Users ***\n`);
		const { users } = setupData;
		await Utils.forEachAsync(users, async (user: any): Promise<void> => {
			try {
				const { name, password, email, status, role: userRole } = user;

				const userExists = await this.userRepository.findByEmail(email);

				if (userExists) {
					throw new Error(`${email} already exists.`);
				}

				const role = await this.roleRepository.findByName(userRole);

				if (!role) {
					throw new Error(`${userRole} not found.`);
				}

				const newUser = new User();
				newUser.trading_name = name;
				newUser.email = email;
				newUser.status = status;
				newUser.role = role;

				const passwordEncrypted = crypto.createHash('md5').update(`${process.env.SALT}${password}`).digest('hex');

				newUser.password = passwordEncrypted;

				await this.userRepository.save(newUser);

				console.log(`${email} registered.`);
			} catch (error) {
				console.log(error.message);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}

	// private async registerProduct(): Promise<void> {
	// 	console.log(`*** Register Products ***\n`);
	// 	const { products } = setupData;
	// 	await Utils.forEachAsync(products, async (user: any): Promise<void> => {
	// 		try {
	// 			const { name, password, email, status, role: userRole } = user;

	// 			const userExists = await this.userRepository.findByEmail(email);

	// 			if (userExists) {
	// 				throw new Error(`${email} already exists.`);
	// 			}

	// 			const role = await this.roleRepository.findByName(userRole);

	// 			if (!role) {
	// 				throw new Error(`${userRole} not found.`);
	// 			}

	// 			const newUser = new User();
	// 			newUser.trading_name = name;
	// 			newUser.email = email;
	// 			newUser.status = status;
	// 			newUser.role = role;

	// 			const passwordEncrypted = crypto.createHash('md5').update(`${process.env.SALT}${password}`).digest('hex');

	// 			newUser.password = passwordEncrypted;

	// 			await this.userRepository.save(newUser);

	// 			console.log(`${email} registered.`);
	// 		} catch (error) {
	// 			console.log(error.message);
	// 		}
	// 	});

	// 	console.log(`\n------------------------------------------------------\n`);
	// }

	private async registerActions(): Promise<void> {
		console.log(`*** Register Actions ***\n`);
		const { actions } = setupData;
		await Utils.forEachAsync(actions, async (action: any): Promise<void> => {
			try {
				const { name, parent: actionParent } = action;
				const actionExists = await this.actionRepository.findByName(name);

				if (actionExists) {
					throw new Error(`${name} already exists.`);
				}

				const newAction = new Action();
				newAction.name = name;

				if (actionParent) {
					const parent = await this.actionRepository.findByName(actionParent);

					if (!parent) {
						throw new Error(`${actionParent} not found.`);
					}
					newAction.parent = parent;
				}
				await this.actionRepository.save(newAction);

				console.log(`${name} registered.`);
			} catch (error) {
				console.log(error.message);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}

	private async registerRoleActions(): Promise<void> {
		console.log(`*** Register Role Actions ***\n`);
		await this.mysqlClient.query('DELETE FROM roles_actions WHERE 1 = 1;');

		const { roleActions } = setupData;
		await Utils.forEachAsync(roleActions, async (roleAction: any): Promise<void> => {
			try {
				const { role: roleName, actions } = roleAction;
				const role = await this.roleRepository.findByName(roleName);

				if (!role) {
					throw new Error(`${roleName} not found.`);
				}

				if (Array.isArray(actions)) {
					await Utils.forEachAsync(actions, async (actionName: any): Promise<void> => {
						const action = await this.actionRepository.findByName(actionName);

						if (!action) {
							throw new Error(`${actionName} not found.`);
						}

						await this.mysqlClient.createQueryBuilder().relation(Role, 'actions').of(action.id).add(role.id);

						console.log(`${actionName} registered to ${roleName}.`);
					});
				} else if (actions === 'all') {
					const allActions = await this.actionRepository.find({
						limit: 999999,
						page: 1,
					});

					await Utils.forEachAsync(allActions, async (action: any): Promise<void> => {
						await this.mysqlClient.createQueryBuilder().relation(Role, 'actions').of(action.id).add(role.id);

						console.log(`${action.name} registered to ${roleName}.`);
					});
				}
			} catch (error) {
				console.log(error);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}

	private async registerSalesTypes(): Promise<void> {
		console.log(`*** Register Sales Types ***\n`);
		const { salesTypes } = setupData;
		await Utils.forEachAsync(salesTypes, async (saleType: any): Promise<void> => {
			try {
				const saleTypeExists = await this.saleTypeRepository.findByReference(saleType.reference);

				if (saleTypeExists) {
					throw new Error(`${saleType.reference} already exists.`);
				}

				const newSaleType = new SaleType();
				Object.assign(newSaleType, saleType);
				await this.saleTypeRepository.save(newSaleType);

				console.log(`${saleType.name} - ${saleType.reference} registered.`);
			} catch (error) {
				console.log(error.message);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}

	private async registerPaymentsTypes(): Promise<void> {
		console.log(`*** Register Payments Types ***\n`);
		const { paymentsTypes } = setupData;
		await Utils.forEachAsync(paymentsTypes, async (paymentType: any): Promise<void> => {
			try {
				const paymentTypeExists = await this.paymentTypeRepository.findByReference(paymentType.reference);

				if (paymentTypeExists) {
					throw new Error(`${paymentType.reference} already exists.`);
				}

				const newPaymentType = new PaymentType();
				Object.assign(newPaymentType, paymentType);
				await this.paymentTypeRepository.save(newPaymentType);

				console.log(`${paymentType.name} - ${paymentType.reference} registered.`);
			} catch (error) {
				console.log(error.message);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}

	private async registerMenus(): Promise<void> {
		console.log(`*** Register Menus ***\n`);
		const { menus } = setupData;
		console.log(menus);

		await Utils.forEachAsync(menus, async (menu: any): Promise<void> => {
			try {
				const menuExists = await this.menuRepository.findByTitleAndUrl(menu.title, menu.url);

				if (menuExists) {
					throw new Error(`${menu.title} (${menu.url}) already exists.`);
				}

				const newMenu = new Menu();
				Object.assign(newMenu, menu);

				if (menu.parent) {
					const parent = await this.menuRepository.findByUrl(menu.parent);
					if (parent) {
						newMenu.parent = parent;
					}
				}

				const action = await this.actionRepository.findByName(menu.action);

				newMenu.action = action;

				await this.menuRepository.save(newMenu);

				console.log(`${menu.title} - ${menu.url} registered.`);
			} catch (error) {
				console.log(error.message);
			}
		});

		console.log(`\n------------------------------------------------------\n`);
	}
}

const setupInit = async () => {
	await init();

	const setup: Setup = container.resolve(Setup);

	await setup.initialize();

	process.exit(0);
};

setupInit();
