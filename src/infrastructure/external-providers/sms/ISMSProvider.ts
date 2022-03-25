export interface ISMSMessage {
	phone: string;
	message: string;
}

export interface ISMSProvider {
	sendSMS(message: ISMSMessage): Promise<void>;
}
