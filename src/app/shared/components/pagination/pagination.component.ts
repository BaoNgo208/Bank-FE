import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  // ── Inputs ───────────────────────────────────────────────────────────
  page = input.required<number>();
  pageSize = input.required<number>();
  totalItems = input.required<number>();
  pageSizeOptions = input<number[]>([10, 20, 50]);

  // ── Outputs ──────────────────────────────────────────────────────────
  pageChange = output<number>();
  pageSizeChange = output<number>();

  // ── Internal state ───────────────────────────────────────────────────
  goToInput: number | null = null;

  // ── Computed ─────────────────────────────────────────────────────────
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pageNumbers = computed((): (number | '...')[] => {
    const total = this.totalPages();
    const cur = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', cur - 1, cur, cur + 1, '...', total];
  });

  // ── Methods ──────────────────────────────────────────────────────────
  go(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(Number(size));
  }

  confirmGoTo(): void {
    if (this.goToInput != null) {
      this.go(this.goToInput);
      this.goToInput = null;
    }
  }

  isNumber(val: number | '...'): val is number {
    return typeof val === 'number';
  }
}
