import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { finalize } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { UserAssetAllocationResponse } from '../../../types/dashboard.type';

Chart.register(...registerables);

@Component({
  selector: 'app-asset-allocation-chart',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './asset-allocation-chart.component.html',
})
export class AssetAllocationChartComponent implements AfterViewInit, OnDestroy {
  private dashboardService = inject(DashboardService);

  @ViewChild('assetAllocationChart')
  assetAllocationChartRef!: ElementRef<HTMLCanvasElement>;

  assetAllocation = signal<UserAssetAllocationResponse | null>(null);
  loadingAssetAllocation = signal(false);

  chart: Chart | null = null;
  viewReady = false;
  chartColors = [
    '#fb7185', // red-500 - Available
    '#f59e0b', // amber-500 - Allocated
    '#60a5fa', // blue-400 - Frozen
    '#e5e7eb', // gray-200 fallback
  ];
  ngAfterViewInit() {
    this.viewReady = true;
    this.loadAssetAllocation();
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  loadAssetAllocation() {
    this.loadingAssetAllocation.set(true);

    this.dashboardService
      .getAssetAllocation()
      .pipe(finalize(() => this.loadingAssetAllocation.set(false)))
      .subscribe({
        next: (res) => {
          this.assetAllocation.set(res.data);

          setTimeout(() => {
            this.renderAssetAllocationChart();
          });
        },
        error: (err) => {
          console.error(err);
          this.assetAllocation.set(null);
          this.destroyChart();
        },
      });
  }

  renderAssetAllocationChart() {
    if (!this.viewReady) return;
    if (!this.assetAllocationChartRef) return;

    const data = this.assetAllocation();

    if (!data || !data.items?.length) {
      this.destroyChart();
      return;
    }

    this.destroyChart();

    const labels = data.items.map((item) => this.formatAllocationKey(item.key));
    const values = data.items.map((item) => Number(item.amount));

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: this.chartColors.slice(0, values.length),
            borderColor: '#ffffff',
            borderWidth: 4,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        cutout: '72%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = data.items[context.dataIndex];

                return `${this.formatAllocationKey(item.key)}: ${Number(item.amount).toLocaleString()} USD (${item.percent}%)`;
              },
            },
          },
        },
      },
    };

    this.chart = new Chart(this.assetAllocationChartRef.nativeElement, config);
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  formatAllocationKey(key: string) {
    switch (key) {
      case 'available_balance':
        return 'Available Balance';
      case 'allocated_balance':
        return 'Allocated Balance';
      case 'frozen_balance':
        return 'Frozen Balance';
      default:
        return key;
    }
  }
}
