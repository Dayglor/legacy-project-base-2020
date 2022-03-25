import amqp from 'amqplib/callback_api';
import md5 from 'md5';
import { IMessagesConsumer } from 'src/messages-consumers/IMessagesConsumer';
import { container } from 'tsyringe';

import { IRabbitMQClient } from '../IRabbitMQClient';

export class RabbitMQClient implements IRabbitMQClient {
	private readonly amqp: any;
	private readonly appName: string;
	private readonly host: string;
	private readonly port: string;
	private readonly username: string;
	private readonly password: string;
	private readonly connectString: string;
	constructor() {
		this.amqp = amqp;
		this.appName = process.env.APP_NAME;
		this.host = process.env.RABBITMQ_HOST;
		this.port = process.env.RABBITMQ_PORT;
		this.username = process.env.RABBITMQ_USERNAME;
		this.password = process.env.RABBITMQ_PASSWORD;
		this.connectString = `amqp://${this.username}:${this.password}@${this.host}:${this.port}`;
	}

	async add(queueName: string, message: any = { empty: true }): Promise<void> {
		const newQueueName = `${this.appName}.${queueName}`;
		try {
			return new Promise((resolve, reject) => {
				try {
					this.amqp.connect(this.connectString, (err1: any, conn: any) => {
						if (err1) {
							console.log(err1);
							reject();
							return false;
						}
						conn.createChannel(async (err2: any, ch: any) => {
							if (err2) {
								console.log(err2);
								reject();
								return false;
							}
							const dataString = JSON.stringify(message);
							ch.assertQueue(newQueueName, {
								durable: false,
								arguments: { 'x-message-deduplication': true },
							});
							ch.sendToQueue(newQueueName, Buffer.from(dataString), {
								headers: { 'x-deduplication-header': md5(dataString) },
							});

							ch.close(() => {
								resolve();
							});
							return true;
						});

						setTimeout(() => {
							if (conn) {
								conn.close();
							}
						}, 1500);

						return true;
					});
				} catch (error) {
					console.log(error.message);
					reject();
				}
			});
		} catch (error) {
			console.log(error.message);
			return null;
		}
	}

	async consume(queues: string[]): Promise<void> {
		try {
			return new Promise((resolve, reject) => {
				try {
					this.amqp.connect(this.connectString, (err1, conn) => {
						if (err1) {
							console.log(err1);
							process.exit(1);
						}
						conn.createChannel((err2, ch) => {
							if (err2) {
								console.log(err2);
								process.exit(2);
							}
							Object.values(queues).forEach((queueName) => {
								const newQueueName = `${this.appName}.${queueName}`;
								const job: IMessagesConsumer = container.resolve(queueName);
								ch.assertQueue(newQueueName, {
									durable: false,
									arguments: { 'x-message-deduplication': true },
								});
								ch.prefetch(25);
								console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', newQueueName);
								ch.consume(newQueueName, async (msg) => {
									console.log(`${newQueueName} | [x] Received ${msg.content.toString()}`);
									const data = JSON.parse(msg.content.toString());

									await job.execute(data);
									ch.ack(msg);
								});
							});
						});
					});
				} catch (error) {
					console.log(error.message);
					reject();
				}
			});
		} catch (error) {
			console.log(error.message);
			return null;
		}
	}
}
