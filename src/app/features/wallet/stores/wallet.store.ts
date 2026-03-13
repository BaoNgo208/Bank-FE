import { Injectable, signal } from '@angular/core';
import { DepositConfigResponse, DepositPreviewResponse } from '../types/wallet.type';

@Injectable({
  providedIn: 'root',
})
export class WalletStore {
  depositConfig = signal<DepositConfigResponse | null>(null);
  depositPreview = signal<DepositPreviewResponse | null>(null);
}
