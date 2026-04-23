import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { InquiryUiStore } from '../inquiry-card/stores/inquiry-ui.store';
import { CashbackService } from './services/cashback.service';
import { CashbackDashboardResponse } from '../inquiry-card/types/type';
import { CashbackStore } from './stores/cashback.store';
import { CashbackModalComponent } from './components/modal/cashback-modal.component';

@Component({
  selector: 'app-cashback-component',
  imports: [CommonModule, CashbackModalComponent],
  templateUrl: './cashback.component.html',
})
export class CashbackComponent {
  private cashBackService = inject(CashbackService);

  protected inquiryUiStore = inject(InquiryUiStore);
  protected cashbackDashboard = signal<CashbackDashboardResponse | null>(null);
  protected cashbackStore = inject(CashbackStore);

  progressPercent = computed(() => {
    const current = this.cashbackDashboard()?.tiers?.find((t) => t.is_current);
    const spent = this.cashbackDashboard()?.total_spent ?? 0;

    if (!current) return 0;

    const range = current.max_spent - current.min_spent;
    if (range <= 0) return 0;

    return ((spent - current.min_spent) / range) * 100;
  });

  overallProgress = computed(() => {
    const tiers = this.cashbackDashboard()?.tiers ?? [];
    const spent = this.cashbackDashboard()?.total_spent ?? 0;

    if (!tiers.length) return 0;

    const min = tiers[0].min_spent;
    const max = tiers[tiers.length - 1].max_spent;

    if (max === min) return 0;

    return ((spent - min) / (max - min)) * 100;
  });

  nextTier = computed(() => {
    const tiers = this.cashbackDashboard()?.tiers ?? [];
    const i = tiers.findIndex((t) => t.is_current);
    return i >= 0 ? tiers[i + 1] : null;
  });

  ngOnInit() {
    this.cashBackService.getDashboard().subscribe({
      next: (res) => {
        this.cashbackDashboard.set(res.data);
      },
      error: (err) => {},
    });
  }
}
