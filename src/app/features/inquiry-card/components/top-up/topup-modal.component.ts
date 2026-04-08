import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InquiryStore } from '../../stores/inquiry.store';
import { InquiryUiStore } from '../../stores/inquiry-ui.store';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { WalletFacade } from '../../../wallet/facades/wallet.facade';

@Component({
  selector: 'app-top-up-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './topup-modal.component.html',
})
export class TopUpModalComponent {
  private walletFacade = inject(WalletFacade);
  private inquiryStore = inject(InquiryStore);
  private toast = inject(ToastrService);

  protected inquiryUiStore = inject(InquiryUiStore);

  walletBalance = signal(0.89);
  availableBalance = signal(1.01);
  currency = signal('USD');
  rechargeFee = signal(0);
  rechargeAmount = signal(0.1);
  isLoading = signal(false);

  readonly MIN_AMOUNT = 0.1;

  isInvalid = computed(() => {
    return this.rechargeAmount() < this.MIN_AMOUNT;
  });

  error = computed(() => {
    return this.isInvalid() ? 'Minimum amount is 0.1' : '';
  });
  estimatedCost = computed(() => {
    return this.rechargeAmount() + this.rechargeFee();
  });

  ngOnInit() {
    this.walletFacade.getBalance().subscribe({
      next: (res) => {
        this.walletBalance.set(res.data.wallet_balance);
        this.availableBalance.set(res.data.card_balance);
      },
      error: (_) => {},
    });
  }

  handleTopup() {
    const selectedCard = this.inquiryStore.selectedCard();
    if (!selectedCard) return;
    this.isLoading.set(true);

    this.walletFacade
      .topupCard(selectedCard?.id, {
        amount: this.rechargeAmount(),
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.inquiryStore.selectedCard.set(null);
          this.inquiryUiStore.isTopUpModalOpen.set(false);
        }),
      )
      .subscribe({
        next: (_) => {
          this.inquiryStore.cardActionResult.set({
            type: 'TOP_UP',
            cardId: selectedCard.id,
            amount: this.rechargeAmount(),
          });
          this.toast.success('Successfully topup to card!');
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message,
            confirmButtonText: 'OK',
          });
        },
      });
  }
}
