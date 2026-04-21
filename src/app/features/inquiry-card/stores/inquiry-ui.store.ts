import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InquiryUiStore {
  isTopUpModalOpen = signal<boolean>(false);
  isWidthdrawlOpen = signal<boolean>(false);
  isConfirmFreezeOpen = signal<boolean>(false);
  showCashbackModal = signal<boolean>(false);
}
