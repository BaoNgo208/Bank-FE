import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CashbackService } from '../../services/cashback.service';
import Swal from 'sweetalert2';
import { CashbackHistoryResponse } from '../../types/type';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-cashback-history-table',
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './cashback-history.componet.html',
})
export class CashbackHistoryComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private cashbackService = inject(CashbackService);

  cashbackHistoryPage = signal(1);
  cashbackHistoryPageSize = signal(10);
  cashbackHistoryTotalItems = signal(0);

  form = this.fb.group({
    checkAll: [false],
    rows: this.fb.array([]),
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  onHistoryPageChange(page: number) {
    this.cashbackHistoryPage.set(page);
    this.loadCashbackHistoryPage();
  }

  onHistorySizeChange(size: number) {
    this.cashbackHistoryPageSize.set(size);
    this.cashbackHistoryPage.set(1);
    this.loadCashbackHistoryPage();
  }

  ngOnInit() {
    this.loadCashbackHistoryPage();
  }

  private loadCashbackHistoryPage() {
    this.cashbackService.getMyCashbackHistory(this.cashbackHistoryPage() - 1).subscribe({
      next: (res) => {
        const content = res.data.items;
        const total = res.data.total_size;
        this.cashbackHistoryTotalItems.set(total);
        this.rows.clear();
        content.forEach((item: CashbackHistoryResponse) =>
          this.rows.push(this.fb.group({ ...item, selected: [false] })),
        );
        this.cd.detectChanges();
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
