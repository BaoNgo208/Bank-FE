import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalletUiStore } from '../stores/wallet-ui.store';
import Swal from 'sweetalert2';
import { WalletFacade } from '../facades/wallet.facade';
import { CreateWithdrawOrderRequest, Stablecoin } from '../types/wallet.type';
import { OtpModalComponent } from '../../../shared/components/otp/otp-modal.component';

@Component({
  selector: 'app-widthdraw-component',
  imports: [CommonModule, FormsModule, OtpModalComponent],
  templateUrl: './widthdrawl.component.html',
})
export class WidthdrawlComponent {
  private walletFacade = inject(WalletFacade);
  protected walletUiStore = inject(WalletUiStore);

  pendingOrderNo = signal<string | null>(null);

  withdrawAmount: number = 500;
  toAddress: string = '';
  otp: string = '';
  remark: string = '';
  currency: Stablecoin = Stablecoin.USDT;
  minAmount = 500;
  balance = 10000;
  network: string = 'TRC20';
  Stablecoin = Stablecoin;

  currentOrderNo: string | null = null;
  orderNo: string = '';

  showOtpModal = signal(false);

  constructor() {
    effect(() => {});
  }

  handleOpenOtp() {
    this.showOtpModal.set(true);
  }

  handleConfirmOtp = (otp: string) => {
    // call API ở đây
    // this.withdrawFacade.confirmOtp(otp)

    this.showOtpModal.set(false);
  };

  ConfirmOtp(otp: string) {
    this.validateOtp();
    const confirmPayload = {
      orderNo: this.orderNo,
      otp: otp,
    };
    this.walletFacade.confirmWithdrawOtp(confirmPayload).subscribe({
      next: (_) => {
        Swal.fire({
          icon: 'success',
          title: 'Create withdraw order success',
        });
        this.walletUiStore.showWithdrawModal.set(false);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'OTP failed',
          text: err?.error?.message,
        });
      },
    });
  }

  closeWithdrawModal() {
    this.walletUiStore.showWithdrawModal.set(false);
  }

  errors = {
    amount: '',
    address: '',
    otp: '',
  };

  validateAmount() {
    if (!this.withdrawAmount) {
      this.errors.amount = 'Amount is required';
    } else if (this.withdrawAmount < this.minAmount) {
      this.errors.amount = `Minimum is ${this.minAmount} USD`;
    } else if (this.withdrawAmount > this.balance) {
      this.errors.amount = 'Insufficient balance';
    } else {
      this.errors.amount = '';
    }
  }

  validateAddress() {
    if (!this.toAddress) {
      this.errors.address = 'Address is required';
      return;
    }

    if (this.network === 'Tron (TRC20)') {
      const trc20Regex = /^T[a-zA-Z0-9]{33}$/;

      if (!trc20Regex.test(this.toAddress)) {
        this.errors.address = 'Invalid TRC20 address';
        return;
      }
    } else if (this.network === 'ETH (ERC20)') {
      const erc20Regex = /^0x[a-fA-F0-9]{40}$/;

      if (!erc20Regex.test(this.toAddress)) {
        this.errors.address = 'Invalid ERC20 address';
        return;
      }
    }

    this.errors.address = '';
  }

  validateOtp() {
    if (!this.otp) {
      this.errors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(this.otp)) {
      this.errors.otp = 'OTP must be 6 digits';
    } else {
      this.errors.otp = '';
    }
  }

  submitWithdraw() {
    this.validateAmount();
    // this.validateAddress();
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    if (this.errors.amount || this.errors.address || this.errors.otp) {
      const messages = [this.errors.amount, this.errors.address, this.errors.otp].filter(Boolean);

      Swal.fire({
        icon: 'error',
        title: 'Invalid input',
        html: messages.map((m) => `• ${m}`).join('<br>'),
        confirmButtonColor: '#ef4444',
      });

      return;
    }

    const payload: CreateWithdrawOrderRequest = {
      currency: this.currency,
      network: this.network,
      to_address: this.toAddress,
      amount: this.withdrawAmount,
    };

    this.walletFacade.createWithdrawOrder(payload).subscribe({
      next: (res) => {
        Swal.close();
        this.orderNo = res.data.order_no;
        this.showOtpModal.set(true);
      },
      error: (err) => {
        this.orderNo = err?.error?.data;
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Create failed',
          text: err?.error?.message,
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
