import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CashbackService } from './services/cashback.service';
import { CashbackStore } from './stores/cashback.store';
import { CashbackModalComponent } from './components/modal/cashback-modal.component';
import { CashbackHistoryComponent } from './components/cashback-history-table/cashback-history.componet';
import { CashbackDashboardResponse } from './types/type';

@Component({
  selector: 'app-cashback-component',
  standalone: true,
  imports: [CommonModule, CashbackModalComponent, CashbackHistoryComponent],
  templateUrl: './cashback.component.html',
})
export class CashbackComponent {
  private cashbackService = inject(CashbackService);

  protected cashbackStore = inject(CashbackStore);
  protected cashbackDashboard = signal<CashbackDashboardResponse | null>(null);

  protected totalSpent = computed(() => this.cashbackDashboard()?.total_spent ?? 0);
  protected tiers = computed(() => this.cashbackDashboard()?.tiers ?? []);

  protected currentTier = computed(() => {
    const tiers = this.tiers();
    const spent = this.totalSpent();

    if (!tiers.length) return null;

    return (
      tiers.find((t) => spent >= t.min_spent && spent <= t.max_spent) ?? tiers[tiers.length - 1]
    );
  });

  protected currentPercent = computed(() => this.currentTier()?.percent ?? 0);

  overallProgress = computed(() => {
    const tiers = this.tiers();
    const spent = this.totalSpent();

    if (!tiers.length) return 0;

    const totalSegments = tiers.length;
    const segmentWidth = 100 / totalSegments;

    const currentIndex = tiers.findIndex((t) => spent >= t.min_spent && spent <= t.max_spent);

    if (currentIndex === -1) return 0;

    const current = tiers[currentIndex];

    // 👉 base position
    const base = currentIndex * segmentWidth;

    // 👉 lấy mốc bắt đầu đúng: max của tier trước
    const prevMax = currentIndex === 0 ? current.min_spent : tiers[currentIndex - 1].max_spent;

    const range = current.max_spent - prevMax;

    const progressInTier = range > 0 ? (spent - prevMax) / range : 0;

    const percent = base + progressInTier * segmentWidth;

    return Math.max(0, Math.min(100, percent));
  });
  protected nextTier = computed(() => {
    const tiers = this.tiers();
    const spent = this.totalSpent();

    return tiers.find((t) => spent < t.min_spent) ?? null;
  });

  protected tierPosition(index: number): number {
    const tiers = this.tiers();
    if (!tiers.length) return 0;

    return (index / tiers.length) * 100;
  }

  isTierReached(tier: any) {
    const spent = this.totalSpent();
    return spent >= tier.max_spent;
  }
  isCurrentTier(tier: any) {
    const spent = this.totalSpent();
    return spent >= tier.min_spent && spent <= tier.max_spent;
  }

  ngOnInit() {
    this.cashbackService.getDashboard().subscribe({
      next: (res) => {
        this.cashbackDashboard.set(res.data);
      },
    });
  }
}
