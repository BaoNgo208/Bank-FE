import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import {
  getSampleChartData,
  generateSampleRangeData,
  ChartRange,
  DashboardStat,
  RecentWithdrawal,
  getSampleStats,
  getSampleRecentWithdrawals,
} from '../../../utils/sample.util';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminDashboardSummaryResponse, DashboardPeriod } from './types/admin-dashboard.type';

interface DashboardStatItem {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements AfterViewInit {
  private dashboardService = inject(AdminDashboardService);
  private cd = inject(ChangeDetectorRef);

  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  selectedRange: ChartRange = 'week';
  startDate: string = '';
  endDate: string = '';
  recentWithdrawals: RecentWithdrawal[] = [];

  stats = signal<DashboardStatItem[]>([]);
  summary = signal<AdminDashboardSummaryResponse | null>(null);

  ngOnInit() {
    this.loadSummary();
  }
  ngAfterViewInit() {
    this.initChart();
    this.loadCashFlow(DashboardPeriod.WEEK);
  }

  loadSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        const data = res.data;

        this.summary.set(data);
        this.stats.set(this.mapSummaryToStats(data));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private mapSummaryToStats(data: AdminDashboardSummaryResponse): DashboardStatItem[] {
    return [
      {
        label: 'Total Users',
        value: data.total_users.toLocaleString(),
        icon: 'fa-users',
        color: 'bg-blue-100 text-blue-600',
      },
      {
        label: 'Pending Withdraw',
        value: data.pending_withdraw_count.toLocaleString(),
        sub: this.formatMoney(data.pending_withdraw_amount),
        icon: 'fa-arrow-up',
        color: 'bg-red-100 text-red-600',
      },
      {
        label: 'Pending Deposit',
        value: data.pending_deposit_count.toLocaleString(),
        sub: this.formatMoney(data.pending_deposit_amount),
        icon: 'fa-arrow-down',
        color: 'bg-green-100 text-green-600',
      },
      {
        label: 'Total Wallet Balance',
        value: this.formatMoney(data.total_wallet_balance),
        icon: 'fa-wallet',
        color: 'bg-purple-100 text-purple-600',
      },
    ];
  }

  private formatMoney(value: string | number | null | undefined): string {
    const num = Number(value ?? 0);

    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  initChart() {
    const data = getSampleChartData(this.selectedRange);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Deposit',
            data: data.deposit,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.12)',
            tension: 0.45,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            borderWidth: 2,
          },
          {
            label: 'Withdraw',
            data: data.withdraw,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            tension: 0.45,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            padding: 12,
            cornerRadius: 10,
            displayColors: true,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#9ca3af',
            },
            border: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(229,231,235,0.8)',
            },
            ticks: {
              color: '#9ca3af',
            },
            border: {
              display: false,
            },
          },
        },
      },
    });
  }
  changeRange(range: ChartRange) {
    this.selectedRange = range;

    const period = this.toDashboardPeriod(range);

    this.loadCashFlow(period);
  }

  private loadCashFlow(period: DashboardPeriod): void {
    this.dashboardService.getCashFlow(period).subscribe({
      next: (res) => {
        const items = res.data.items ?? [];

        const labels = items.map((item) => item.label);
        const depositData = items.map((item) => Number(item.deposit_amount ?? 0));
        const withdrawData = items.map((item) => Number(item.withdraw_amount ?? 0));

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = depositData;
        this.chart.data.datasets[1].data = withdrawData;

        this.chart.update();
      },
      error: (err) => {
        console.error('load cash flow error:', err);
      },
    });
  }

  private toDashboardPeriod(range: ChartRange): DashboardPeriod {
    switch (range) {
      case 'week':
        return DashboardPeriod.WEEK;
      case 'month':
        return DashboardPeriod.MONTH;
      case 'year':
        return DashboardPeriod.YEAR;
      default:
        return DashboardPeriod.WEEK;
    }
  }
}
