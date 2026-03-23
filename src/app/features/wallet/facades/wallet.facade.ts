import { inject, Injectable } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import {
  ConfirmWithdrawOtpRequest,
  CreateDepositOrderRequest,
  CreateWithdrawOrderRequest,
  DepositPreviewRequest,
  Stablecoin,
} from '../types/wallet.type';
import { WalletStore } from '../stores/wallet.store';
import { WidthdrawlService } from '../services/widthdrawl.service';

@Injectable({
  providedIn: 'root',
})
export class WalletFacade {
  private walletService = inject(WalletService);
  private walletStore = inject(WalletStore);
  private widthdrawlService = inject(WidthdrawlService);

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

  createWithdrawOrder(request: CreateWithdrawOrderRequest) {
    return this.widthdrawlService.createWithdrawOrder(request);
  }

  confirmWithdrawOtp(request: ConfirmWithdrawOtpRequest) {
    return this.widthdrawlService.confirmWithdrawOtp(request);
  }

  resendWithdrawOtp(orderNo: string) {
    return this.widthdrawlService.resendWithdrawOtp(orderNo);
  }
}
