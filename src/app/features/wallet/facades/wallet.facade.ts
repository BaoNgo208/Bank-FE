import { inject, Injectable, signal } from '@angular/core';
import { DepositService } from '../services/deposit.service';
import {
  ConfirmWithdrawOtpRequest,
  CreateDepositOrderRequest,
  CreateWithdrawOrderRequest,
  DepositPreviewRequest,
  Stablecoin,
  WithdrawOrderStatus,
} from '../types/wallet.type';
import { WalletStore } from '../stores/wallet.store';
import { WidthdrawlService } from '../services/widthdrawl.service';
import { WalletService } from '../services/wallet.service';
import { delay, finalize } from 'rxjs';
import { DepositOrderStatus } from '../../admin/deposit-orders-management/types/deposit.type';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class WalletFacade {
  private depositService = inject(DepositService);
  private walletStore = inject(WalletStore);
  private widthdrawlService = inject(WidthdrawlService);
  private walletService = inject(WalletService);
  private toast = inject(ToastrService);

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
        error: (err) => {
          this.toast.error(err?.error?.message);
        },
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
        error: (err) => {
          this.toast.error(err?.error?.message);
        },
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
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
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

  searchDepositOrders(
    page?: number,
    params?: {
      orderNo?: string;
      address?: string;
      status?: DepositOrderStatus;
      fromTime?: string;
      toTime?: string;
    },
  ) {
    return this.depositService.searchDepositOrders(page, params);
  }
}
