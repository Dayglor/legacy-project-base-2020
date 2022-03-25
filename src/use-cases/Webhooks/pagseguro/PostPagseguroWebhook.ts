export interface IPagseguroWebhook {
	notificationCode: string;
	notificationType: string;
}

export interface IPagseguroParmsWebhook {
	email?: string;
}
