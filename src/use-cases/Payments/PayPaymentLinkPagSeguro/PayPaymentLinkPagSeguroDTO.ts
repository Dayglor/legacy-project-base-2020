export interface IPayPaymentLinkPagSeguroDTO {
	paymentId: string;
	cardOwner: string;
	cardNationalRegistration: string;
	cardPhone: string;
	cardBirthDate: string;
	installments: number;
	installmentAmount: number;
	senderHash: string;
	creditCardToken: string;
}
