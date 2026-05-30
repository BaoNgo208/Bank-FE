import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InquiryStore } from '../../stores/inquiry.store';
import { InquiryUiStore } from '../../stores/inquiry-ui.store';
import { WalletFacade } from '../../../wallet/facades/wallet.facade';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-widthdrawl-card-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './widthdrawl-modal.component.html',
})
export class WidthdrawlCardModalComponent {
  private inquiryStore = inject(InquiryStore);
  private walletFacade = inject(WalletFacade);
  private toast = inject(ToastrService);

  protected inquiryUiStore = inject(InquiryUiStore);

  availableBalance = signal(1.01);
  currency = signal('USD');
  transferAmount = signal(0.1);
  isLoading = signal(false);
  readonly MIN_AMOUNT = 0.1;

  isInvalid = computed(() => {
    return this.transferAmount() < this.MIN_AMOUNT;
  });

  error = computed(() => {
    return this.isInvalid() ? 'Minimum amount is 0.1' : '';
  });

  ngOnInit() {
    this.walletFacade.getBalance().subscribe({
      next: (res) => {
        this.availableBalance.set(res.data.card_balance);
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });
  }

  handleWidthdrawl() {
    const selectedCard = this.inquiryStore.selectedCard();
    if (!selectedCard) return;
    this.isLoading.set(true);

    this.walletFacade
      .withDrawCard(selectedCard?.id, {
        amount: this.transferAmount(),
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.inquiryStore.selectedCard.set(null);
          this.inquiryUiStore.isWidthdrawlOpen.set(false);
        }),
      )
      .subscribe({
        next: (_) => {
          this.inquiryStore.cardActionResult.set({
            type: 'WITHDRAW',
            cardId: selectedCard.id,
            amount: this.transferAmount(),
          });
          this.toast.success('Successfully widthdrawl!');
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
