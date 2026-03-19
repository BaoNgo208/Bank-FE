import { inject, Injectable } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { CreateDepositOrderRequest, DepositPreviewRequest, Stablecoin } from '../types/wallet.type';
import { WalletStore } from '../stores/wallet.store';

@Injectable({
  providedIn: 'root',
})
export class WalletFacade {
  private walletService = inject(WalletService);
  private walletStore = inject(WalletStore);

  getDepositConfig(currency: Stablecoin) {
    this.walletService.getDepositConfig(currency).subscribe({
      next: (res) => {
        this.walletStore.depositConfig.set(res.data);
      },
      error: (_) => {},
    });
  }

  previewDeposit(request: DepositPreviewRequest) {
    this.walletService.previewDeposit(request).subscribe({
      next: (res) => {
        this.walletStore.depositPreview.set(res.data);
      },
      error: (_) => {},
    });
  }

  createDepositOrder(request: CreateDepositOrderRequest) {
    return this.walletService.createDepositOrder(request);
  }

  getDepositOrders(page: number) {
    return this.walletService.getDepositOrders(page);
  }

  uploadDepositImages(orderNo: string, images: File[]) {
    this.walletService.uploadDepositImages(orderNo, images).subscribe({
      next: () => {
        this.walletStore.uploadSuccess.set(true);
      },
      error: (_) => {},
    });
  }
}
