import { Payment } from '@infrastructure/database/entities/Payment';
import { PaymentCard } from '@infrastructure/database/entities/PaymentCard';
import { IBuyScoreDTO } from '@useCases/Scores/BuyScores/BuyScoresDTO';

export class PaymentCardFactory {
	async makePaymentCardFromBuyScoreDTO(data: IBuyScoreDTO, payment: Payment): Promise<PaymentCard> {
		const paymentCard = new PaymentCard();
		paymentCard.payment = payment;
		paymentCard.card = data.tokenizedCard;

		return paymentCard;
	}
}
