import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CashbackService } from '../../../cashback/services/cashback.service';
import { CashbackHistoryResponse } from '../../../../cashback/types/type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cashback-history-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './cashback-history.component.html',
})
export class CashbackHistoryModal {
  @Input({ required: true }) userId!: number;
  @Input() displayName = '';

  @Output() closed = new EventEmitter<void>();

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
    this.cashbackService
      .getUserCashbackHistory(this.userId, this.cashbackHistoryPage() - 1)
      .subscribe({
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

  close(): void {
    this.closed.emit();
  }
}
