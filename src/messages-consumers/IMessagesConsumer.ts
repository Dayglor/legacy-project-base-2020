export interface IMessagesConsumer {
	execute(data: any): Promise<boolean>;
}
