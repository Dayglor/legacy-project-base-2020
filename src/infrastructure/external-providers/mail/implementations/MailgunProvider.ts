import MailgunFactory from 'mailgun-js';
import path from 'path';
import pug from 'pug';

import {
	IMailProvider,
	IMessage,
	ISaleMail,
	ISendMail,
	IConsultantMail,
	IApprovePreRegisterMail,
	IPreRegisterMail,
} from '../IMailProvider';

export class MailgunProvider implements IMailProvider {
	private transporter;
	private apiKey = process.env.MAILGUN_API_KEY;
	private domain = process.env.MAILGUN_DOMAIN;

	constructor() {
		this.transporter = new MailgunFactory({ apiKey: this.apiKey, domain: this.domain });
	}

	async sendMail(message: IMessage): Promise<void> {
		const data = {
			to: `${message.to.email}`,
			from: `${process.env.APP_NAME}} <${process.env.APP_NO_REPLY_MAIL}>`,
			subject: message.subject,
			html: message.body,
		};

		await this.transporter.messages().send(data, (err) => {
			if (err) {
				console.log(err);
				throw new Error('Não foi possível enviar o e-mail');
			} else {
				console.log('Enviado com sucesso');
			}
		});
	}

	async submitMail(data: ISendMail): Promise<void> {
		await this.transporter.messages().send(data, (err) => {
			if (err) {
				console.log(err);
				throw new Error('Não foi possível enviar o e-mail');
			} else {
				console.log('Enviado com sucesso');
			}
		});
	}

	async sendSaleMail(data: ISaleMail): Promise<void> {
		const { client } = data;

		// console.log(client);
		// console.log(`path: ${__dirname}, pathResolve: ${path.resolve('src/infrastructure/emails/views/sendSaleMail.pug')}`);
		// const logo =
		const dataSubmit = {
			// logo,
			to: `${client.email}`,
			// to: 'dayglor@zsystems.com.br',
			// cc: 'dayglor@hotmail.com',
			from: 'Clear Solutions  <sistema@clearsolutions.com.br>',
			subject: 'Nova Venda - Clear Solutions',
			html: pug.renderFile(path.resolve('src/infrastructure/emails/views/sendSaleMail.pug'), data),
		};

		await this.submitMail(dataSubmit);
	}

	async sendConsultantMail(data: IConsultantMail): Promise<void> {
		const dataSubmit = {
			to: data.email,
			from: 'Clear Solutions  <sistema@clearsolutions.com.br>',
			subject: 'Cadastro de Consultor - Clear Solutions',
			html: pug.renderFile(path.resolve('src/infrastructure/emails/views/sendConsultantMail.pug'), data),
		};

		await this.submitMail(dataSubmit);
	}

	async sendApprovePreRegisterMail(data: IApprovePreRegisterMail): Promise<void> {
		const dataSubmit = {
			to: data.email,
			from: 'Clear Solutions  <sistema@clearsolutions.com.br>',
			subject: 'Aprovação de Pré-Cadastro - Clear Solutions',
			html: pug.renderFile(path.resolve('src/infrastructure/emails/views/sendApprovePreRegisterMail.pug'), data),
		};

		await this.submitMail(dataSubmit);
	}

	async sendPreRegisterMail(data: IPreRegisterMail): Promise<void> {
		const dataSubmit = {
			to: 'renan.costa@zsystems.com.br',
			from: 'Clear Solutions  <sistema@clearsolutions.com.br>',
			subject: 'Pré-Cadastro - Clear Solutions',
			html: pug.renderFile(path.resolve('src/infrastructure/emails/views/sendPreRegisterMail.pug'), data),
		};

		await this.submitMail(dataSubmit);
	}
}
