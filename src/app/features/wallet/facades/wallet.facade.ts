import { inject, Injectable, signal } from '@angular/core';
import { DepositService } from '../services/deposit.service';
import {
  ConfirmWithdrawOtpRequest,
  CreateCardRequest,
  CreateDepositOrderRequest,
  CreateWithdrawOrderRequest,
  DepositPreviewRequest,
  Stablecoin,
  TopupCardRequest,
  WithDrawCardRequest,
  WithdrawOrderStatus,
} from '../types/wallet.type';
import { WalletStore } from '../stores/wallet.store';
import { WidthdrawlService } from '../services/widthdrawl.service';
import { WalletService } from '../services/wallet.service';
import { delay, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletFacade {
  private depositService = inject(DepositService);
  private walletStore = inject(WalletStore);
  private widthdrawlService = inject(WidthdrawlService);
  private walletService = inject(WalletService);

  loading = signal<boolean>(false);

  getDepositConfig(currency: Stablecoin) {
    this.loading.set(true);
    this.depositService
      .getDepositConfig(currency)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.walletStore.depositConfig.set(res.data);
        },
        error: (_) => {},
      });
  }

  previewDeposit(request: DepositPreviewRequest) {
    this.loading.set(true);
    this.depositService
      .previewDeposit(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
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

  topupCard(cardId: number, request: TopupCardRequest) {
    return this.walletService.topupCard(cardId, request);
  }

  getCards(page: number) {
    return this.walletService.getCards(page);
  }

  withDrawCard(cardId: number, request: WithDrawCardRequest) {
    return this.walletService.withDrawCard(cardId, request);
  }

  getBalance() {
    return this.walletService.getBalance();
  }

  getWithdrawOrders(page: number = 0) {
    return this.widthdrawlService.getWithdrawOrders(page);
  }

  getDashboard() {
    return this.walletService.getDashboard();
  }

  searchWidthdrawlOrders(
    page?: number,
    params?: {
      orderNo?: string;
      address?: string;
      status?: WithdrawOrderStatus;
      fromTime?: string;
      toTime?: string;
    },
  ) {
    return this.widthdrawlService.searchWidthdrawlOrders(page, params);
  }
}
