import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  selectedRange: ChartRange = 'week';
  startDate: string = '';
  endDate: string = '';
  stats: DashboardStat[] = [];
  recentWithdrawals: RecentWithdrawal[] = [];

  ngOnInit() {
    this.stats = getSampleStats();
    this.recentWithdrawals = getSampleRecentWithdrawals();
  }
  ngAfterViewInit() {
    this.initChart();
  }

  applyCustomRange() {
    if (!this.startDate || !this.endDate) return;

    if (!this.isRangeValid(this.startDate, this.endDate)) {
      alert('Range tối đa 30 ngày');
      return;
    }

    const days = this.generateDateRange(this.startDate, this.endDate);

    const { deposit, withdraw } = generateSampleRangeData(days);

    this.chart.data.labels = days;
    this.chart.data.datasets[0].data = deposit;
    this.chart.data.datasets[1].data = withdraw;

    this.chart.update();
  }

  generateDateRange(start: string, end: string): string[] {
    const result = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      result.push(`${current.getDate()}/${current.getMonth() + 1}`);
      current.setDate(current.getDate() + 1);
    }

    return result;
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
            backgroundColor: 'rgba(34,197,94,0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Withdraw',
            data: data.withdraw,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  isRangeValid(start: string, end: string): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    return diff <= 30;
  }

  changeRange(range: ChartRange) {
    this.selectedRange = range;

    const data = getSampleChartData(range);

    this.chart.data.labels = data.labels;
    this.chart.data.datasets[0].data = data.deposit;
    this.chart.data.datasets[1].data = data.withdraw;

    this.chart.update();
  }
}
