import { Component, inject, signal } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { buildSampleRechargeRecords, buildSampleTransferRecords } from '../../utils/sample.util';
import { WalletFacade } from './facades/wallet.facade';
import { Stablecoin } from './types/wallet.type';
import { WalletStore } from './stores/wallet.store';

@Component({
  selector: 'app-wallet-component',
  standalone: true,
  imports: [CountUpDirective, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
})
export class WalletComponent {
  private fb = inject(FormBuilder);
  private walletFacade = inject(WalletFacade);
  protected walletStore = inject(WalletStore);

  showTopupModal = false;
  amount = 100;

  showPaymentModal = false;

  orderNumber = '20260313205051131748X103591';

  countdown = signal('60:00');

  timer: any;
  seconds = 3600;
  depositPreview = this.walletStore.depositPreview;

  copyAddress() {
    const preview = this.depositPreview();
    if (!preview) return;

    navigator.clipboard.writeText(preview.address);
  }

  startCountdown() {
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.seconds--;

      const m = Math.floor(this.seconds / 60);
      const s = this.seconds % 60;

      this.countdown.set(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

      if (this.seconds <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }
  openPaymentModal() {
    this.walletFacade.previewDeposit({
      currency: Stablecoin.USDT,
      amount: this.amount,
      network: 'Tron (TRC20)',
    });
    this.seconds = 3600;
    this.showPaymentModal = true;
    this.startCountdown();
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    clearInterval(this.timer);
  }
  openModal() {
    this.showTopupModal = true;
    this.walletFacade.getDepositConfig(Stablecoin.USDT);
  }

  closeModal() {
    this.showTopupModal = false;
  }

  form = this.fb.group({
    checkAllRecharge: [false],
    checkAllTransfer: [false],

    rechargeRows: this.fb.array([]),
    transferRows: this.fb.array([]),
  });

  constructor() {
    this.initData();
  }

  /* ------------------- GETTERS ------------------- */

  get rechargeRows(): FormArray {
    return this.form.get('rechargeRows') as FormArray;
  }

  get transferRows(): FormArray {
    return this.form.get('transferRows') as FormArray;
  }

  /* ------------------- INIT DATA ------------------- */

  private initData() {
    // Recharge records
    buildSampleRechargeRecords.forEach((item) => {
      this.rechargeRows.push(
        this.fb.group({
          selected: false,
          orderNumber: item.orderNumber,
          currency: item.currency,
          channel: item.channel,
          amount: item.amount,
          state: item.state,
          reason: item.reason,
          remark: item.remark,
          creationTime: item.creationTime,
        }),
      );
    });

    // Transfer records
    buildSampleTransferRecords.forEach((item) => {
      this.transferRows.push(
        this.fb.group({
          selected: false,
          transferOutAccount: item.transferOutAccount,
          transferToAccount: item.transferToAccount,
          transferAmount: item.transferAmount,
          remark: item.remark,
          creationTime: item.creationTime,
        }),
      );
    });
  }
}
