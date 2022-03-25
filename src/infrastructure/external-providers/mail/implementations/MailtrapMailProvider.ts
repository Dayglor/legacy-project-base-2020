import nodemailer from 'nodemailer';

import { IMailProvider, IMessage } from '../IMailProvider';

export class MailtrapMailProvider implements IMailProvider {
	private transporter;
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: process.env.MAILTRAP_USER,
				pass: process.env.MAILTRAP_PASS,
			},
		});
	}
	async sendMail(message: IMessage): Promise<void> {
		await this.transporter.sendMail({
			to: {
				name: message.to.name,
				address: message.to.email,
			},
			from: {
				name: process.env.APP_NAME,
				address: process.env.APP_NO_REPLY_MAIL,
			},
			subject: message.subject,
			html: message.body,
		});
	}
}
