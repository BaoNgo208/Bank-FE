import { Component, inject, signal, ViewChild } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WalletFacade } from './facades/wallet.facade';
import { Stablecoin, WithdrawOrderStatus } from './types/wallet.type';
import { WalletStore } from './stores/wallet.store';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { WalletUiStore } from './stores/wallet-ui.store';
import { WidthdrawlComponent } from './components/widthdrawl.component';
import { ToastrService } from 'ngx-toastr';
import { DepositTransactionsComponent } from '../wallet-transactions/deposits/deposit-transactions.component';
import { WithdrawalTransactionComponent } from '../wallet-transactions/withdrawals/withdrawal-transactions.component';

@Component({
  selector: 'app-wallet-component',
  standalone: true,
  imports: [
    CountUpDirective,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PaginationComponent,
    MatTableModule,
    MatPaginatorModule,
    WidthdrawlComponent,
    DepositTransactionsComponent,
    WithdrawalTransactionComponent,
  ],
  templateUrl: './wallet.component.html',
})
export class WalletComponent {
  private walletFacade = inject(WalletFacade);
  private toast = inject(ToastrService);

  protected walletStore = inject(WalletStore);
  protected walletUiStore = inject(WalletUiStore);

  @ViewChild(DepositTransactionsComponent)
  depositTransactionsComponent!: DepositTransactionsComponent;

  walletBalance = signal<number>(0.0);

  showTopupModal = false;
  amount = 100;
  showPaymentModal = false;
  countdown = signal('60:00');
  private timer: any;
  private seconds = 3600;
  selectedNetwork = 'TRC20';
  depositPreview = this.walletStore.depositPreview;
  proofFile: File | null = null;
  proofPreview: string | null = null;
  showCurrencyModal = false;
  currency: Stablecoin = Stablecoin.USDT;
  Stablecoin = Stablecoin;

  WithdrawOrderStatus = WithdrawOrderStatus;

  ngOnInit() {
    this.walletFacade.getBalance().subscribe({
      next: (res) => {
        this.walletBalance.set(res.data.wallet_balance);
      },
      error: (_) => {},
    });
  }

  openWidthdrawlModal() {
    this.walletUiStore.showWithdrawModal.set(true);
  }

  // ── Proof upload ──────────────────────────────────────────────────────
  onProofSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.proofFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.proofPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  submitProof(): void {
    if (!this.proofFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Proof Image Required',
        text: 'Please upload your transfer proof before submitting.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const file = this.proofFile;

    this.walletFacade
      .createDepositOrder({
        currency: Stablecoin.USDT,
        amount: this.amount,
        network: this.selectedNetwork,
      })
      .subscribe({
        next: (res) => {
          const order = res.data;
          this.depositTransactionsComponent.addOptimisticOrder(order);
          this.walletStore.depositOrder.set(order);

          this.walletFacade.uploadDepositImages(order.order_no, [file]);
          this.showPaymentModal = false;
          this.showTopupModal = false;

          this.resetDepositForm();
          this.toast.success('Create top up request successfully');
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Create order failed');
        },
      });
  }

  private resetDepositForm() {
    this.amount = 100;
    this.selectedNetwork = 'TRC20';
    this.proofFile = null;
    this.proofPreview = null;
  }
  // ── Modal / payment ───────────────────────────────────────────────────
  copyAddress(): void {
    const preview = this.depositPreview();
    if (preview) navigator.clipboard.writeText(preview.address);
  }

  openModal(): void {
    this.showTopupModal = true;
    this.walletFacade.getDepositConfig(Stablecoin.USDT);
  }
  closeModal(): void {
    this.showTopupModal = false;
  }

  openPaymentModal(): void {
    this.walletFacade.previewDeposit({
      currency: Stablecoin.USDT,
      amount: this.amount,
      network: this.selectedNetwork,
    });
    this.seconds = 3600;
    this.showPaymentModal = true;
    this.startCountdown();
  }

  onNetworkChange(network: string) {
    this.selectedNetwork = network;

    this.walletFacade.previewDeposit({
      currency: Stablecoin.USDT,
      amount: this.amount,
      network: this.selectedNetwork,
    });
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    clearInterval(this.timer);
  }

  private startCountdown(): void {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.seconds--;
      const m = Math.floor(this.seconds / 60);
      const s = this.seconds % 60;
      this.countdown.set(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      if (this.seconds <= 0) clearInterval(this.timer);
    }, 1000);
  }
}
