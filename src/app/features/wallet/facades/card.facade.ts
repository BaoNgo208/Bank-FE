import { inject, Injectable } from '@angular/core';
import { CardService } from '../services/card.service';
import { CardStatus } from '../types/wallet.type';

@Injectable({
  providedIn: 'root',
})
export class CardFacade {
  private cardService = inject(CardService);

  lockCard(cardId: number) {
    return this.cardService.lockCard(cardId);
  }

  unlockCard(cardId: number) {
    return this.cardService.unlockCard(cardId);
  }

  getCardDashboard() {
    return this.cardService.getCardDashboard();
  }

  searchCards(
    page?: number,
    params?: {
      cardNumber?: string;
      cardName?: string;
      status?: CardStatus;
      fromTime?: string;
      toTime?: string;
    },
  ) {
    return this.cardService.searchCards(page, params);
  }
}
