import { inject, Injectable } from '@angular/core';
import { CardService } from '../services/card.service';

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
}
