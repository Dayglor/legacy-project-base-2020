import { Card } from '@infrastructure/database/entities/Card';
import { IBuyScoreDTO } from '@useCases/Scores/BuyScores/BuyScoresDTO';

export class CardFactory {
	async makeFromBuyScoreDTO(data: IBuyScoreDTO): Promise<Card> {
		const card = new Card();
		card.user = data.user;
		card.bin = data.card.number.slice(-4);
		card.name = data.card.owner;
		card.month = data.card.expirationMonth;
		card.year = data.card.expirationYear;
		card.brand = '';
		card.external_id = data.externalId;
		return card;
	}
}
