import { autoInjectable, inject } from 'tsyringe';
import { Connection } from 'typeorm';

import { Action } from '@infrastructure/database/entities/Action';
import { Address } from '@infrastructure/database/entities/Address';
import { BillCategory } from '@infrastructure/database/entities/BillCategory';
import { BillToPay } from '@infrastructure/database/entities/BillToPay';
import { BillToPayProof } from '@infrastructure/database/entities/BillToPayProof';
import { Client } from '@infrastructure/database/entities/Client';
import { Company } from '@infrastructure/database/entities/Company';
import { Contact } from '@infrastructure/database/entities/Contact';
import { ContactLink } from '@infrastructure/database/entities/ContactLink';
import { ContactType } from '@infrastructure/database/entities/ContactType';
import { DocumentType } from '@infrastructure/database/entities/DocumentType';
import { Menu } from '@infrastructure/database/entities/Menu';
import { PaymentType } from '@infrastructure/database/entities/PaymentType';
import { Product } from '@infrastructure/database/entities/Product';
import { ProductCategory } from '@infrastructure/database/entities/ProductCategory';
import { Role } from '@infrastructure/database/entities/Role';
import { SaleType } from '@infrastructure/database/entities/SaleType';
import { ShippingCompany } from '@infrastructure/database/entities/ShippingCompany';
import { User } from '@infrastructure/database/entities/User';
import { UserQuery } from '@infrastructure/database/entities/UserQuery';
import { UserQueryHistory } from '@infrastructure/database/entities/UserQueryHistory';
import { IActionRepository } from '@infrastructure/repositories/IActionRepository';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';
import { IBillCategoryRepository } from '@infrastructure/repositories/IBillCategoryRepository';
import { IBillToPayProofRepository } from '@infrastructure/repositories/IBillToPayProofRepository';
import { IBillToPayRepository } from '@infrastructure/repositories/IBillToPayRepository';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';
import { ICompanyRepository } from '@infrastructure/repositories/ICompanyRepository';
import { IContactLinkRepository } from '@infrastructure/repositories/IContactLinkRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IContactTypeRepository } from '@infrastructure/repositories/IContactTypeRepository';
import { IDocumentTypeRepository } from '@infrastructure/repositories/IDocumentTypeRepository';
import { IMenuRepository } from '@infrastructure/repositories/IMenuRepository';
import { IPaymentTypeRepository } from '@infrastructure/repositories/IPaymentTypeRepository';
import { IProductCategoryRepository } from '@infrastructure/repositories/IProductCategoryRepository';
import { IProductRepository } from '@infrastructure/repositories/IProductRepository';
import { IRoleRepository } from '@infrastructure/repositories/IRoleRepository';
import { ISaleTypeRepository } from '@infrastructure/repositories/ISaleTypeRepository';
import { IShippingCompanyRepository } from '@infrastructure/repositories/IShippingCompanyRepository';
import { IUserQueryHistoryRepository } from '@infrastructure/repositories/IUserQueryHistoryRepository';
import { IUserQueryRepository } from '@infrastructure/repositories/IUserQueryRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';

import data from './database-init';

@autoInjectable()
export class DatabaseStart {
	constructor(
		@inject('MysqlClient') private readonly mysqlClient: Connection,
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
		@inject('IContactTypeRepository') private readonly contactTypeRepository: IContactTypeRepository,
		@inject('IDocumentTypeRepository') private readonly documentTypeRepository: IDocumentTypeRepository,
		@inject('IPaymentTypeRepository') private readonly paymentTypeRepository: IPaymentTypeRepository,
		@inject('IActionRepository') private readonly actionRepository: IActionRepository,
		@inject('IMenuRepository') private readonly menuRepository: IMenuRepository,
		@inject('IClientRepository') private readonly clientRepository: IClientRepository,
		@inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
		@inject('IProductRepository') private readonly productRepository: IProductRepository,
		@inject('IProductCategoryRepository') private readonly productCategoryRepository: IProductCategoryRepository,
		@inject('IShippingCompanyRepository') private readonly shippingCompanyRepository: IShippingCompanyRepository,
		@inject('IBillCategoryRepository') private readonly billCategoryRepository: IBillCategoryRepository,
		@inject('IBillToPayRepository') private readonly billToPayRepository: IBillToPayRepository,
		@inject('IBillToPayProofRepository') private readonly billToPayProofRepository: IBillToPayProofRepository,
		@inject('IUserQueryRepository') private readonly userQueryRepository: IUserQueryRepository,
		@inject('IUserQueryHistoryRepository') private readonly userQUeryHistoryRepository: IUserQueryHistoryRepository,
		@inject('IContactLinkRepository') private readonly contactLinkRepository: IContactLinkRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository,
		@inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
		@inject('ISaleTypeRepository') private readonly saleTypeRepository: ISaleTypeRepository
	) {}

	async initialize(): Promise<void> {
		await this.clearDatabase();

		await this.initContactTypes();
		await this.initPaymentTypes();
		await this.initDocumentTypes();
		await this.initContactLinks();
		await this.initPaymentsTypes();
		await this.initAddress();
		await this.initContacts();
		await this.initRoles();
		await this.initUsers();
		await this.initActions();
		await this.initMenus();
		await this.initClients();
		await this.initCompanies();
		await this.initProducts();
		await this.initProductsCategories();
		await this.initBillsCategories();
		await this.initBillsToPay();
		await this.initBillsToPayProof();
		await this.initShippingCompanies();
		await this.initUserQueries();
		await this.initUserQueryHistory();
		await this.initSaleType();
	}

	private async getEntities() {
		const entities = [];
		this.mysqlClient.entityMetadatas.forEach((x) => entities.push({ name: x.name, tableName: x.tableName }));
		return entities;
	}

	private async initContactTypes(): Promise<void> {
		await Utils.forEachAsync(data.contactTypes, async (contactType: any) => {
			const ct = new ContactType();
			Object.assign(ct, contactType);

			await this.contactTypeRepository.save(ct);
		});
	}

	private async initDocumentTypes(): Promise<void> {
		await Utils.forEachAsync(data.documentTypes, async (documentType: any) => {
			const dt = new DocumentType();
			Object.assign(dt, documentType);

			await this.documentTypeRepository.save(dt);
		});
	}

	private async initPaymentsTypes(): Promise<void> {
		await Utils.forEachAsync(data.payments_types, async (paymentType: any) => {
			const dt = new PaymentType();
			Object.assign(dt, paymentType);

			await this.paymentTypeRepository.save(dt);
		});
	}

	private async initPaymentTypes(): Promise<void> {
		await Utils.forEachAsync(data.paymentTypes, async (paymentType: any) => {
			const pt = new PaymentType();
			Object.assign(pt, paymentType);

			await this.paymentTypeRepository.save(pt);
		});
	}

	private async initRoles(): Promise<void> {
		await Utils.forEachAsync(data.roles, async (role: any) => {
			const { id, name } = role;
			const r = new Role(id);
			r.name = name;

			await this.roleRepository.save(r);
		});
	}

	private async initUsers() {
		await Utils.forEachAsync(data.users, async (user: any) => {
			const u = new User();
			Object.assign(u, user);

			const role = await this.roleRepository.findById(user.roleId);

			u.trading_name = user.tradingName;
			u.role = role;
			if (user.contact_link_id) {
				const contactLink = await this.contactLinkRepository.findById(user.contact_link_id);
				u.contact_link = contactLink;
			}

			if (user.address_id) {
				const address = await this.addressRepository.findById(user.address_id);
				u.address = address;
			}

			if (user.birth_date) {
				u.birth_date = user.birth_date;
			}

			if (user.national_registration) {
				u.national_registration = user.national_registration;
			}

			await this.userRepository.save(u);
		});
	}

	private async initAddress() {
		await Utils.forEachAsync(data.addresses, async (address: any) => {
			const u = new Address();
			Object.assign(u, address);

			u.postal_code = address.postal_code;
			// u.role = role;

			await this.addressRepository.save(u);
		});
	}

	private async initSaleType() {
		await Utils.forEachAsync(data.sales_types, async (saleType: any) => {
			const u = new SaleType();
			Object.assign(u, saleType);

			// u.postal_code = saleType.postal_code;
			// u.role = role;

			await this.saleTypeRepository.save(u);
		});
	}

	private async initContactLinks(): Promise<void> {
		await Utils.forEachAsync(data.contacts_links, async (cl: any) => {
			const c = new ContactLink();
			Object.assign(c, cl);

			await this.contactLinkRepository.save(c);
		});
	}

	private async initContacts(): Promise<void> {
		await Utils.forEachAsync(data.contacts, async (cl: any) => {
			const c = new Contact();
			Object.assign(c, cl);

			if (cl.contact_type_id) {
				const dataContactType = await this.contactTypeRepository.findById(cl.contact_type_id);
				c.contact_type = dataContactType;
			}

			if (cl.contact_link_id) {
				const contactLink = await this.contactLinkRepository.findById(cl.contact_link_id);
				c.contact_link = contactLink;
			}

			await this.contactRepository.save(c);
		});
	}

	private async initClients(): Promise<void> {
		await Utils.forEachAsync(data.clients, async (clients: any) => {
			const c = new Client();
			Object.assign(c, clients);

			await this.clientRepository.save(c);
		});
	}

	private async initProducts(): Promise<void> {
		await Utils.forEachAsync(data.products, async (product: any) => {
			const p = new Product();
			Object.assign(p, product);

			p.sale_price = product.salePrice;
			p.stock_quantity = product.stockQuantity;
			p.user = <any>product.userId;

			await this.productRepository.save(p);
		});
	}

	private async initUserQueries(): Promise<void> {
		await Utils.forEachAsync(data.users_queries, async (query: any) => {
			const p = new UserQuery();
			Object.assign(p, query);

			p.user = <any>query.userId;
			p.quantity_available = query.quantity_available;

			await this.userQueryRepository.save(p);
		});
	}

	private async initUserQueryHistory(): Promise<void> {
		await Utils.forEachAsync(data.users_queries_histories, async (query: any) => {
			const p = new UserQueryHistory();
			Object.assign(p, query);

			await this.userQUeryHistoryRepository.save(p);
		});
	}

	private async initProductsCategories(): Promise<void> {
		await Utils.forEachAsync(data.productsCategories, async (productsCategories: any) => {
			const pc = new ProductCategory();
			Object.assign(pc, productsCategories);

			await this.productCategoryRepository.save(pc);
		});
	}

	private async initCompanies(): Promise<void> {
		await Utils.forEachAsync(data.companies, async (companies: any) => {
			const c = new Company();
			Object.assign(c, companies);

			await this.companyRepository.save(c);
		});
	}

	private async initBillsCategories(): Promise<void> {
		await Utils.forEachAsync(data.billsCategories, async (billsCategories: any) => {
			const bc = new BillCategory();
			Object.assign(bc, billsCategories);

			await this.billCategoryRepository.save(bc);
		});
	}

	private async initBillsToPay(): Promise<void> {
		await Utils.forEachAsync(data.billsToPay, async (billsToPay: any) => {
			const btp = new BillToPay();
			Object.assign(btp, billsToPay);

			btp.due_date = billsToPay.dueDate;
			btp.bill_category = billsToPay.categoryId;
			btp.user = billsToPay.userId;
			btp.company = billsToPay.companyId;

			await this.billToPayRepository.save(btp);
		});
	}

	private async initBillsToPayProof(): Promise<void> {
		await Utils.forEachAsync(data.billsToPayProof, async (billsToPayProof: any) => {
			const btpp = new BillToPayProof();
			Object.assign(btpp, billsToPayProof);

			btpp.amount_paid = billsToPayProof.amountPaid;
			btpp.payment_type = billsToPayProof.paymentTypeId;
			btpp.bill_to_pay = billsToPayProof.billToPayId;

			await this.billToPayProofRepository.save(btpp);
		});
	}

	private async initShippingCompanies(): Promise<void> {
		await Utils.forEachAsync(data.shippingCompanies, async (shippingCompanies: any) => {
			const sc = new ShippingCompany();
			sc.id = shippingCompanies.id;
			sc.trading_name = shippingCompanies.tradingName;

			await this.shippingCompanyRepository.save(sc);
		});
	}

	private async initActions() {
		await Utils.forEachAsync(data.actions, async (action: any) => {
			const a = new Action();
			Object.assign(a, action);

			await this.actionRepository.save(a);

			const roleActions = data.roleActions.filter((ra) => ra.actionId === a.id);
			await Utils.forEachAsync(roleActions, async (roleAction: any) => {
				await this.mysqlClient.createQueryBuilder().relation(Action, 'roles').of(a.id).add(roleAction.roleId);
			});
		});
	}

	private async initMenus(): Promise<void> {
		await Utils.forEachAsync(data.menus, async (menu: any) => {
			const m = new Menu();
			Object.assign(m, menu);

			await this.menuRepository.save(m);
		});
	}

	async clearDatabase(): Promise<void> {
		const entities = await this.getEntities();
		await this.cleanAll(entities);
	}

	private async cleanAll(entities: any) {
		try {
			await Utils.forEachAsync(entities, async (entity: any) => {
				const repository = this.mysqlClient.getRepository(entity.name);
				await repository.query(`SET foreign_key_checks = 0;`);
				await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
				await repository.query(`SET foreign_key_checks = 1;`);
			});
		} catch (error) {
			throw new Error(`ERROR: Cleaning test db: ${error}`);
		}
	}
}
