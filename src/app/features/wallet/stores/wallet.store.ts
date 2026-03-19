import { Injectable, signal } from '@angular/core';
import {
  CreateDepositOrderResponse,
  DepositConfigResponse,
  DepositOrderPageResponse,
  DepositPreviewResponse,
} from '../types/wallet.type';

@Injectable({
  providedIn: 'root',
})
export class WalletStore {
  depositConfig = signal<DepositConfigResponse | null>(null);
  depositPreview = signal<DepositPreviewResponse | null>(null);

  depositOrder = signal<CreateDepositOrderResponse | null>(null);

  depositOrders = signal<DepositOrderPageResponse | null>(null);

  uploadSuccess = signal<boolean>(false);
}
