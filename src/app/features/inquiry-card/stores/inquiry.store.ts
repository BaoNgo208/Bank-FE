import { Injectable, signal } from '@angular/core';
import { InfiniCardResponse } from '../../wallet/types/infini-card.type';

@Injectable({
  providedIn: 'root',
})
export class InquiryStore {
  selectedCard = signal<InfiniCardResponse | null>(null);
  /** Increases after a top-up or withdrawal, so that the list reloads. */
  fundingChanged = signal(0);
}
