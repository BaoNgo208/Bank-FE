import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WalletUiStore {
  showWithdrawModal = signal<boolean>(false);
}
