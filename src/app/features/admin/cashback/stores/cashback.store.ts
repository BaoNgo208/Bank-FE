import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CashbackStore {
  isShowModal = signal<boolean>(false);
}
