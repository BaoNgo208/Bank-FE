import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { WalletService } from '../wallet/services/wallet.service';
import { CardCreationStore } from '../wallet/stores/card-creation.store';
import { CardCreationConfigResponse } from '../wallet/types/infini-card.type';

@Component({
  selector: 'app-apply-card-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './apply-card.component.html',
})
export class ApplyCardComponent {
  private walletService = inject(WalletService);
  private destroyRef = inject(DestroyRef);
  protected creation = inject(CardCreationStore);

  config = signal<CardCreationConfigResponse | null>(null);
  configError = signal<string | null>(null);

  cardName = signal('');
  holderName = signal('');
  amount = signal(10);
  remark = signal('');

  busy = computed(() => this.creation.submitting() || this.creation.polling());
  total = computed(() => this.amount() + Number(this.config()?.creation_fee ?? 0));

  amountError = computed(() => {
    const config = this.config();
    const amount = this.amount();
    if (!config) return '';
    if (amount < Number(config.min_amount)) return `Minimum amount is ${config.min_amount} USD`;
    if (!/^\d+(\.\d{1,2})?$/.test(String(amount))) return 'Use at most 2 decimal places';
    if (amount > Number(config.max_amount)) return 'Insufficient wallet balance for amount and fee';
    return '';
  });

  canSubmit = computed(
    () =>
      !this.busy() &&
      !!this.config()?.can_create &&
      !this.amountError() &&
      !!this.cardName().trim() &&
      !!this.holderName().trim(),
  );

  constructor() {
    this.creation.resume();
    // Reloads the balance whenever a creation starts or ends.
    effect(() => {
      this.busy();
      untracked(() => this.loadConfig());
    });
  }

  onSubmit() {
    if (!this.canSubmit()) return;
    this.creation.submit({
      name: this.cardName().trim(),
      holderName: this.holderName().trim(),
      amount: this.amount(),
      note: this.remark().trim() || undefined,
    });
  }

  private loadConfig() {
    this.walletService
      .getCardCreationConfig()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.config.set(res.data);
          this.configError.set(null);
        },
        error: (err) =>
          this.configError.set(err?.error?.message ?? 'Unable to load card settings.'),
      });
  }
}
