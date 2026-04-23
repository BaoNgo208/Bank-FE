import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CashbackStore {
  showCashbackModal = signal<boolean>(false);
}
