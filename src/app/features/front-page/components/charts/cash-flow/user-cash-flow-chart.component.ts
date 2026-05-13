import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
  ChartConfiguration,
} from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { DashboardPeriod } from '../../../../admin/dashboard/types/admin-dashboard.type';
import { DashboardService } from '../../../services/dashboard.service';
import { UserCashFlowPointResponse } from '../../../types/dashboard.type';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
);

@Component({
  selector: 'app-user-cash-flow-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-cash-flow-chart.component.html',
})
export class UserCashFlowChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private dashboardService = inject(DashboardService);
  private toast = inject(ToastrService);

  protected readonly DashboardPeriod = DashboardPeriod;

  selectedRange = signal<DashboardPeriod>(DashboardPeriod.WEEK);
  loading = signal(false);

  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    this.loadCashFlow(this.selectedRange());
  }

  changeRange(period: DashboardPeriod): void {
    if (this.selectedRange() === period) return;

    this.selectedRange.set(period);
    this.loadCashFlow(period);
  }

  private loadCashFlow(period: DashboardPeriod): void {
    this.loading.set(true);

    this.dashboardService.getUserCashFlow(period).subscribe({
      next: (res) => {
        const items = res.data?.items ?? [];

        if (this.chart) {
          this.updateChart(items);
        } else {
          this.initChart(items);
        }
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Load cash flow failed');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  private initChart(items: UserCashFlowPointResponse[]): void {
    const chartData = this.mapChartData(items);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Deposit',
            data: chartData.deposit,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            tension: 0.45,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            borderWidth: 2,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
          {
            label: 'Withdraw',
            data: chartData.withdraw,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            tension: 0.45,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            borderWidth: 2,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
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
            callbacks: {
              label: (context) => {
                const value = Number(context.raw ?? 0);
                return `${context.dataset.label}: ${this.formatMoney(value)}`;
              },
            },
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
              callback: (value) => this.formatCompactNumber(Number(value)),
            },
            border: {
              display: false,
            },
          },
        },
      },
    } satisfies ChartConfiguration<'line'>);
  }

  private updateChart(items: UserCashFlowPointResponse[]): void {
    if (!this.chart) return;

    const chartData = this.mapChartData(items);

    this.chart.data.labels = chartData.labels;
    this.chart.data.datasets[0].data = chartData.deposit;
    this.chart.data.datasets[1].data = chartData.withdraw;

    this.chart.update();
  }

  private mapChartData(items: UserCashFlowPointResponse[]) {
    return {
      labels: items.map((item) => item.label),
      deposit: items.map((item) => Number(item.deposit_amount ?? 0)),
      withdraw: items.map((item) => Number(item.withdraw_amount ?? 0)),
    };
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatCompactNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
