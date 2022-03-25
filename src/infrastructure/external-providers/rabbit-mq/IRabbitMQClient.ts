export interface IRabbitMQClient {
	add(queueName: string, message: any): Promise<void>;
	consume(queues: string[]): Promise<void>;
}
