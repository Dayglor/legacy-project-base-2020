import fs from 'fs';
import { autoInjectable, inject } from 'tsyringe';
import { Connection, EntityManager, Transaction, TransactionManager } from 'typeorm';

import { Client } from '@infrastructure/database/entities/Client';
import { Contact } from '@infrastructure/database/entities/Contact';
import { ContactLink } from '@infrastructure/database/entities/ContactLink';
import { Delivery } from '@infrastructure/database/entities/Delivery';
import { Document } from '@infrastructure/database/entities/Document';
import { DocumentLink } from '@infrastructure/database/entities/DocumentLink';
import { Payment } from '@infrastructure/database/entities/Payment';
import { Sale } from '@infrastructure/database/entities/Sale';
import { SaleCommission } from '@infrastructure/database/entities/SaleCommission';
import { SaleProduct } from '@infrastructure/database/entities/SaleProduct';
import { IAWSS3 } from '@infrastructure/external-providers/aws/IAWSS3Provider';
import { IMailProvider } from '@infrastructure/external-providers/mail/IMailProvider';
import { ZspayPaymentGatewayProvider } from '@infrastructure/external-providers/paymentGateway/implementations/zspay/ZspayPaymentGatewayProvider';
import { AddressFactory } from '@infrastructure/factories/AddressFactory';
import { ClientFactory } from '@infrastructure/factories/ClientFactory';
import { PaymentFactory } from '@infrastructure/factories/PaymentFactory';
import { IRegisterSaleProduct, ProductFactory } from '@infrastructure/factories/ProductFactory';
import { SaleCommissionFactory } from '@infrastructure/factories/SaleCommissionFactory';
import { IAddressRepository } from '@infrastructure/repositories/IAddressRepository';
import { IClientRepository } from '@infrastructure/repositories/IClientRepository';
import { IContactLinkRepository } from '@infrastructure/repositories/IContactLinkRepository';
import { IContactRepository } from '@infrastructure/repositories/IContactRepository';
import { IContactTypeRepository } from '@infrastructure/repositories/IContactTypeRepository';
import { IDeliveryRepository } from '@infrastructure/repositories/IDeliveryRepository';
import { IDocumentLinkRepository } from '@infrastructure/repositories/IDocumentLinkRepository';
import { IDocumentRepository } from '@infrastructure/repositories/IDocumentRepository';
import { IPaymentRepository } from '@infrastructure/repositories/IPaymentRepository';
import { IPaymentTicketRepository } from '@infrastructure/repositories/IPaymentTicketRepository';
import { ISaleCommissionRepository } from '@infrastructure/repositories/ISaleCommissionRepository';
import { ISaleProductRepository } from '@infrastructure/repositories/ISaleProductRepository';
import { ISaleRepository } from '@infrastructure/repositories/ISaleRepository';
import { ISaleTypeRepository } from '@infrastructure/repositories/ISaleTypeRepository';
import { IUserRepository } from '@infrastructure/repositories/IUserRepository';
import { Utils } from '@infrastructure/utils';
import Formatter from '@infrastructure/utils/formatter';

import { IRegisterSaleDTO } from './RegisterSaleDTO';

@autoInjectable()
export class RegisterSaleUseCase {
	constructor(
		@inject('MysqlClient') private readonly mysqlClient: Connection,
		@inject('IClientRepository') private readonly clientRepository: IClientRepository,
		@inject('ISaleRepository') private readonly saleRepository: ISaleRepository,
		@inject('ISaleProductRepository') private readonly saleProductRepository: ISaleProductRepository,
		@inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
		@inject('ISaleCommissionRepository') private readonly saleCommissionRepository: ISaleCommissionRepository,
		@inject('IDeliveryRepository') private readonly deliveryRepository: IDeliveryRepository,
		@inject('IDocumentRepository') private readonly documentRepository: IDocumentRepository,
		@inject('IDocumentLinkRepository') private readonly documentLinkRepository: IDocumentLinkRepository,
		@inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
		@inject('IPaymentTicketRepository') private readonly paymentTicketRepository: IPaymentTicketRepository,
		@inject('ISaleTypeRepository') private readonly saleTypeRepository: ISaleTypeRepository,
		@inject('IUserRepository') private readonly userRepository: IUserRepository,
		@inject('IContactLinkRepository') private readonly contactLinkRepository: IContactLinkRepository,
		@inject('IContactTypeRepository') private readonly contactTypeRepository: IContactTypeRepository,
		@inject('IContactRepository') private readonly contactRepository: IContactRepository,
		@inject('AWS-S3') private readonly S3: IAWSS3,
		@inject('IMailProvider') private readonly mailProvider: IMailProvider,
		private readonly zspayPaymentGateway: ZspayPaymentGatewayProvider,
		private readonly productFactory: ProductFactory,
		private readonly clientFactory: ClientFactory,
		private readonly addressFactory: AddressFactory,
		private readonly saleCommissionFactory: SaleCommissionFactory,
		private readonly paymentFactory: PaymentFactory
	) {}

	@Transaction()
	async execute(data: IRegisterSaleDTO, @TransactionManager() manager?: EntityManager): Promise<Sale> {
		const {
			userId,
			notes,
			products: productsData,
			client: clientData,
			deliveryAddress: deliveryAddressData,
			commissions: commissionsData,
			// deliveryFee,
			discountType,
			discount,
			reasonForDiscount,
			files,
			payments: paymentsData,
			sendMailToClient,
			shipping,
		} = data;

		const user = await this.userRepository.findById(userId);
		let mainUserId = user.id;
		if (user.parent?.id) {
			mainUserId = user.parent?.id;
		}

		const sale = new Sale();

		if (!Array.isArray(productsData) || !productsData.length) {
			throw new Error('Você precisa selecionar ao menos 1 produto.');
		}

		const saleType = await this.saleTypeRepository.findByReference(1);
		sale.sale_type = saleType;

		const products = await this.productFactory.makeFromRegisterSaleProductDTO(mainUserId, productsData, manager);

		let client: Client = null;
		let clientAddress = null;

		if (clientData?.id) {
			client = await this.clientRepository.findById(clientData.id);
			if (!client) {
				throw new Error('Cliente não encontrado.');
			}
		} else {
			clientAddress = await this.addressFactory.makeFromRegisterAddressDTO(clientData.address);
			clientData.tradingName = clientData.name;
			client = await this.clientFactory.makeFromRegisterClientDTO(clientData, manager);
			client.address = clientAddress;
			client.user = <any>mainUserId;
			await Utils.validate(client);
			await Utils.validate(client.address);

			const contactLink = new ContactLink();

			client.contact_link = contactLink;

			await this.contactLinkRepository.save(client.contact_link);

			const { contacts: contactsData } = clientData;
			if (contactsData) {
				Utils.forEachAsync2(contactsData, async (contact: any) => {
					const newContact = new Contact();

					newContact.contact = contact.contact.replace(/[^\d]/g, '');
					newContact.name = clientData.tradingName;

					Object.assign(newContact, contact);

					if (!contact.reference) {
						if (contact.contact.replace(/\D/g, '').length === 11) {
							contact.reference = 2;
						} else {
							contact.reference = 1;
						}
					}
					const contactType = await this.contactTypeRepository.findByReference(contact.reference);

					if (!contactType) {
						throw new Error(`${contact.reference} - Referência de tipo de contato não encontrado.`);
					}

					newContact.contact_type = <any>contactType;
					newContact.contact_link = client.contact_link;

					await this.contactRepository.save(newContact);
				});
			}
		}

		const productAmount = productsData.reduce((r, p) => {
			const prod = products.find((a: any) => a.id === p.id);

			if (prod) {
				r += +prod.sale_price * p.quantity;
				return r;
			}

			return r;
		}, 0);

		sale.user = <any>mainUserId;
		sale.user_created = <any>userId;
		sale.client = client;
		sale.notes = notes;
		sale.gross_amount = productAmount;
		sale.amount = productAmount;
		sale.discount_amount = discount.replace(/\D/g, '');
		sale.discount_type = discountType;
		sale.discount_reason = reasonForDiscount;

		const deliveryAddress = await this.addressFactory.makeFromRegisterAddressDTO(deliveryAddressData);

		await Utils.validate(deliveryAddress);
		const delivery = new Delivery();
		delivery.sale = sale;
		delivery.address = deliveryAddress;
		delivery.delivery_fee = shipping.shippingFee.replace(/\D/g, '');
		delivery.customer_fee = shipping.enableShippingFee;
		delivery.shipped = shipping.shipped;
		if (shipping.shippingCompanyId) {
			// console.log(shipping.shippingCompanyId);
			delivery.shippingCompany = <any>shipping.shippingCompanyId;
		}
		delivery.type = shipping.deliveryType;

		if (shipping.shippingFee) {
			const grossAmount = +sale.gross_amount + +delivery.delivery_fee;
			sale.gross_amount = <any>`${grossAmount}`;
		}

		const commissions = await this.saleCommissionFactory.makeFromRegisterSaleCommissionDTO(commissionsData);

		if (userId !== mainUserId) {
			const userCommission = await this.saleCommissionFactory.makeFromRegisterSaleUserCommission(
				userId,
				user.commision
			);
			commissions.push(userCommission);
		}

		const payments = await this.paymentFactory.makeFromRegisterSalePaymentDTO(paymentsData, mainUserId);

		// Validates

		await Utils.forEachAsync2(payments, async (payment: Payment) => {
			await Utils.validate(payment);
		});

		if (files.length > 0) {
			const documentLink = new DocumentLink();
			sale.document_link = documentLink;

			await this.documentLinkRepository.save(documentLink, manager);

			await Utils.forEachAsync2(files, async (file) => {
				const s3File = await this.S3.upload({
					Body: fs.readFileSync(file.path),
					Bucket: 'consultores-bucket',
					ContentType: file.type,
					Key: `sales/files/${Date.now()}_${file.name}`,
				});

				const newDocument = new Document();
				newDocument.file_name = file.name;
				newDocument.mimetype = file.type;
				newDocument.size = file.size;
				newDocument.url = s3File.Location;
				newDocument.document_link = documentLink;

				await Utils.validate(newDocument);

				await this.documentRepository.save(newDocument, manager);
			});
		}

		// Save
		if (clientAddress) {
			await this.addressRepository.save(clientAddress, manager);
		}

		if (client) {
			await this.clientRepository.save(client, manager);
		}

		client = await this.clientRepository.findById(client.id, manager);

		await this.saleRepository.save(sale, manager);

		await Utils.forEachAsync2(productsData, async (product: IRegisterSaleProduct) => {
			const saleProduct = new SaleProduct();
			saleProduct.sale = <any>sale.id;
			saleProduct.product = <any>product.id;
			saleProduct.quantity = product.quantity;
			saleProduct.amount = (<any>product.unitPrice.toFixed(2) * 100).toString();
			await this.saleProductRepository.save(saleProduct, manager);
		});

		await this.addressRepository.save(deliveryAddress, manager);

		await this.deliveryRepository.save(delivery, manager);

		await Utils.forEachAsync2(commissions, async (commission: SaleCommission) => {
			commission.sale = sale;
			await this.saleCommissionRepository.save(commission, manager);
		});
		await Utils.forEachAsync2(payments, async (payment: Payment) => {
			const paymentData = paymentsData.find((p) => p.id === payment.id);

			payment.sale = sale;

			const paymentType = payment.payment_type.reference;
			switch (paymentType) {
				// Crédito
				case 1: {
					// const result = await this.zspayPaymentGateway.creditSale({
					// 	user: client,
					// 	card: {
					// 		owner: '',
					// 		number: '',
					// 		cvv: '',
					// 		expirationMonth: '',
					// 		expirationYear: '',
					// 	},
					// 	amount: `${payment.amount}`,
					// 	installments: payment.installments,
					// });
					break;
				}
				// Débito
				case 2: {
					break;
				}
				// Boleto
				case 3: {
					if (paymentData?.createTicket) {
						const result = await this.zspayPaymentGateway.ticketSale({
							user: client,
							amount: payment.amount,
							dueDate: payment.payment_ticket.due_date,
							interest: payment.payment_ticket.interest,
							lateFee: payment.payment_ticket.late_fee,
							description: payment.payment_ticket.description,
						});
						payment.external_id = result?.id;
						payment.payment_ticket.url = result?.urlBoleto;
						payment.payment_ticket.barcode = result?.boleto?.codigo_barras;
					}
					break;
				}
				// Assinatura / Recorrência
				case 4: {
					let planId;
					try {
						planId = await this.zspayPaymentGateway.createPlan(
							{
								title: 'Venda - ClearSolutions',
								description: '',
								amount: +(+payment.amount / (+payment.max_installments || 1)).toFixed(2),
								setupAmount: 0,
								gracePeriod: 0,
								frequency: 'monthly',
								interval: '1',
								subscriptionDuration: payment.max_installments || false,
							},
							+user.zspay_id
						);
					} catch (error) {
						console.log(error);
						throw new Error(`Erro ao cadastrar o plano para pagamento. ${error.message}`);
					}

					let signature;
					if (paymentData?.cardNumber && paymentData?.cardOwner) {
						if (!paymentData?.cardOwner) {
							throw new Error('(PaymentType: 4) - Nome completo do titular do cartão não pode ser vazio.');
						}
						if (!paymentData?.cardNumber) {
							throw new Error('(PaymentType: 4) - Número do cartão não pode ser vazio.');
						}
						if (!paymentData?.cardCvv) {
							throw new Error('(PaymentType: 4) - CVV não pode ser vazio.');
						}
						if (!paymentData?.cardExpirationMonth) {
							throw new Error('(PaymentType: 4) - Mês de validade não pode ser vazio.');
						}
						if (!paymentData?.cardExpirationYear) {
							throw new Error('(PaymentType: 4) - Ano de validade não pode ser vazio.');
						}

						signature = await this.zspayPaymentGateway.signPlan({
							planId: `${planId}`,
							card: {
								owner: paymentData?.cardOwner,
								cvv: paymentData?.cardCvv,
								expirationMonth: paymentData?.cardExpirationMonth,
								expirationYear: paymentData?.cardExpirationYear,
								number: paymentData?.cardNumber,
							},
							user: client,
						});
					}

					payment.external_plan_id = planId;
					payment.external_id = signature;
					break;
				}
				// Link de Pagamento
				case 5: {
					break;
				}
				// Cheque
				case 6: {
					break;
				}
				// Dinheiro
				case 7: {
					break;
				}
				default:
					throw new Error(`Payment Type ${paymentType} not found.`);
			}

			await this.paymentRepository.save(payment, manager);
			if (payment.payment_ticket && paymentData?.sendMail) {
				await this.paymentTicketRepository.save(payment.payment_ticket, manager);

				await this.mailProvider.sendMail({
					to: {
						email: client.email,
						name: client.trading_name,
					},
					subject: 'Boleto - Clear Solutions',
					body: `Boleto gerado com sucesso.<br/><br/>URL: ${payment.payment_ticket.url}<br/>Código de Barras: ${payment.payment_ticket.barcode}`,
				});
			}
		});

		if (sendMailToClient) {
			const paymentFormatted = payments.map((v) => {
				return {
					id: v.id,
					paymentType: { ...v.payment_type },
					installments: v.installments,
					amount: `${v.amount}`,
				};
			});

			payments.map((v, k) => {
				paymentFormatted[k].amount = <any>Formatter.Real(v.amount / 100);

				return true;
			});

			const saleMailData = {
				client,
				products: productsData,
				payments: paymentFormatted,
				valueTotal: await Formatter.Real(productAmount / 100),
			};

			await this.mailProvider.sendSaleMail(saleMailData);
		}

		const newSale = await this.saleRepository.findById(sale.id, manager);

		if (!newSale) {
			throw new Error(`Sale ${sale.id} not found.`);
		}

		return newSale;
	}
}
