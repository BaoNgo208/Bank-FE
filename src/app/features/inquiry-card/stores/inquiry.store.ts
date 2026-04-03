import { Injectable, signal } from '@angular/core';
import { CardListResponse } from '../../wallet/types/wallet.type';

type CardActionResult =
  | { type: 'TOP_UP'; cardId: number; amount: number }
  | { type: 'WITHDRAW'; cardId: number; amount: number };

@Injectable({
  providedIn: 'root',
})
export class InquiryStore {
  selectedCard = signal<CardListResponse | null>(null);
  cardActionResult = signal<CardActionResult | null>(null);
}
