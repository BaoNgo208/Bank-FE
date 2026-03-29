import { Component, effect, inject, signal } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { buildSampleRechargeRecords, buildSampleTransferRecords } from '../../utils/sample.util';
import { WalletFacade } from './facades/wallet.facade';
import { Stablecoin } from './types/wallet.type';
import { WalletStore } from './stores/wallet.store';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { WalletUiStore } from './stores/wallet-ui.store';
import { WidthdrawlComponent } from './components/widthdrawl.component';

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
  ],
  templateUrl: './wallet.component.html',
})
export class WalletComponent {
  private fb = inject(FormBuilder);
  private walletFacade = inject(WalletFacade);
  protected walletStore = inject(WalletStore);
  private cd = inject(ChangeDetectorRef);

  protected walletUiStore = inject(WalletUiStore);

  showTopupModal = false;
  amount = 100;
  showPaymentModal = false;
  countdown = signal('60:00');
  private timer: any;
  private seconds = 3600;
  selectedNetwork = 'Tron (TRC20)';
  depositPreview = this.walletStore.depositPreview;
  proofFile: File | null = null;
  proofPreview: string | null = null;
  showCurrencyModal = false;
  currency: Stablecoin = Stablecoin.USDT;
  Stablecoin = Stablecoin;

  rechargePage = 1;
  rechargePageSize = 10;
  rechargeTotalItems = 0;

  transferPage = 1;
  transferPageSize = 10;
  transferTotalItems = 0;

  form = this.fb.group({
    rechargeRows: this.fb.array([]),
    transferRows: this.fb.array([]),
  });

  constructor() {
    effect(() => {
      console.log(this.rechargeTotalItems);
    });
  }

  ngOnInit() {
    this.loadRechargePage();
    this.loadTransferPage();
  }

  get rechargeRows(): FormArray {
    return this.form.get('rechargeRows') as FormArray;
  }
  get transferRows(): FormArray {
    return this.form.get('transferRows') as FormArray;
  }

  openWidthdrawlModal() {
    this.walletUiStore.showWithdrawModal.set(true);
  }

  // ── Recharge ─────────────────────────────────────────────────────────
  onRechargePageChange(page: number): void {
    this.rechargePage = page;
    this.loadRechargePage();
  }
  onRechargePageSizeChange(size: number): void {
    this.rechargePageSize = size;
    this.rechargePage = 1;
    this.loadRechargePage();
  }

  private loadRechargePage(): void {
    this.walletFacade.getDepositOrders(this.rechargePage - 1).subscribe((res) => {
      const content = res.data.items;
      const total = res.data.total_size;

      this.rechargeTotalItems = total;

      this.rechargeRows.clear();
      content.forEach((item: any) => this.rechargeRows.push(this.fb.group(item)));

      this.cd.detectChanges();
    });
  }
  // ── Transfer ─────────────────────────────────────────────────────────
  onTransferPageChange(page: number): void {
    this.transferPage = page;
    this.loadTransferPage();
  }
  onTransferPageSizeChange(size: number): void {
    this.transferPageSize = size;
    this.transferPage = 1;
    this.loadTransferPage();
  }

  private loadTransferPage(): void {
    // this.transferTotalItems = this.loadPage(
    //   buildSampleTransferRecords,
    //   this.transferPage,
    //   this.transferPageSize,
    //   (slice) => {
    //     this.transferRows.clear();
    //     slice.forEach((item) => this.transferRows.push(this.fb.group(item)));
    //   },
    // );
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
          this.rechargeRows.insert(
            0,
            this.fb.group({
              ...order,
              admin_note: null,
              created_at: new Date().toISOString(),
            }),
          );

          this.rechargeTotalItems++;
          this.walletStore.depositOrder.set(order);

          this.walletFacade.uploadDepositImages(order.order_no, [file]);
          this.showPaymentModal = false;
          this.showTopupModal = false;

          this.resetDepositForm();
        },
        error: () => {
          alert('create order failed');
        },
      });
  }

  private resetDepositForm() {
    this.amount = 100;
    this.selectedNetwork = 'Tron (TRC20)';
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
