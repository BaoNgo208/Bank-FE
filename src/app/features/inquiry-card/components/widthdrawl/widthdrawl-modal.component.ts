import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { InquiryStore } from '../../stores/inquiry.store';
import { InquiryUiStore } from '../../stores/inquiry-ui.store';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { InfiniFundingFlow } from '../../../wallet/services/infini-card.service';
import { INFINI_FUNDING_MIN_AMOUNT } from '../../../wallet/types/infini-card.type';

@Component({
  selector: 'app-widthdrawl-card-modal',
  imports: [CommonModule],
  templateUrl: './widthdrawl-modal.component.html',
})
export class WidthdrawlCardModalComponent {
  private inquiryStore = inject(InquiryStore);
  private funding = inject(InfiniFundingFlow);
  private toast = inject(ToastrService);

  protected inquiryUiStore = inject(InquiryUiStore);

  readonly MIN_AMOUNT = INFINI_FUNDING_MIN_AMOUNT;

  card = this.inquiryStore.selectedCard;
  currency = signal('USD');
  transferAmount = signal(INFINI_FUNDING_MIN_AMOUNT);
  isLoading = signal(false);

  // The backend checks the real card balance at the provider before moving funds.
  cardBalance = computed(() => Number(this.card()?.remaining_amount ?? 0));

  error = computed(() => {
    const amount = this.transferAmount();
    if (amount < this.MIN_AMOUNT) return `Minimum amount is ${this.MIN_AMOUNT} USD`;
    if (!/^\d+(\.\d{1,2})?$/.test(String(amount))) return 'Use at most 2 decimal places';
    if (amount > this.cardBalance()) return 'Insufficient card balance';
    return '';
  });
  isInvalid = computed(() => !!this.error());

  handleWidthdrawl() {
    const card = this.card();
    if (!card || this.isLoading() || this.isInvalid()) return;
    this.isLoading.set(true);

    this.funding
      .run('withdraw', card.id, this.transferAmount())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (order) => {
          if (order.status === 'FAILED') {
            this.showError('The withdrawal was rejected. No funds were moved.');
            return;
          }
          if (order.status === 'SUCCEEDED') {
            this.toast.success('Funds moved to your wallet successfully.');
          } else {
            this.toast.info('The withdrawal is still being processed.');
          }

          this.inquiryStore.fundingChanged.update((n) => n + 1);
          this.close();
        },
        error: (err) =>
          this.showError(err?.error?.message ?? 'Unable to reach the server. Please try again.'),
      });
  }

  close() {
    this.inquiryStore.selectedCard.set(null);
    this.inquiryUiStore.isWidthdrawlOpen.set(false);
  }

  private showError(text: string) {
    Swal.fire({ icon: 'error', title: 'Error', text, confirmButtonText: 'OK' });
  }
}
