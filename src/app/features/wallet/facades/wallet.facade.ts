import { inject, Injectable } from '@angular/core';
import { DepositService } from '../services/deposit.service';
import {
  ConfirmWithdrawOtpRequest,
  CreateCardRequest,
  CreateDepositOrderRequest,
  CreateWithdrawOrderRequest,
  DepositPreviewRequest,
  Stablecoin,
} from '../types/wallet.type';
import { WalletStore } from '../stores/wallet.store';
import { WidthdrawlService } from '../services/widthdrawl.service';
import { WalletService } from '../services/wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletFacade {
  private depositService = inject(DepositService);
  private walletStore = inject(WalletStore);
  private widthdrawlService = inject(WidthdrawlService);
  private walletService = inject(WalletService);

  getDepositConfig(currency: Stablecoin) {
    this.depositService.getDepositConfig(currency).subscribe({
      next: (res) => {
        this.walletStore.depositConfig.set(res.data);
      },
      error: (_) => {},
    });
  }

  previewDeposit(request: DepositPreviewRequest) {
    this.depositService.previewDeposit(request).subscribe({
      next: (res) => {
        this.walletStore.depositPreview.set(res.data);
      },
      error: (_) => {},
    });
  }

  createDepositOrder(request: CreateDepositOrderRequest) {
    return this.depositService.createDepositOrder(request);
  }

  getDepositOrders(page: number) {
    return this.depositService.getDepositOrders(page);
  }

  uploadDepositImages(orderNo: string, images: File[]) {
    this.depositService.uploadDepositImages(orderNo, images).subscribe({
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

  createCard(request: CreateCardRequest) {
    return this.walletService.createCard(request);
  }
}
