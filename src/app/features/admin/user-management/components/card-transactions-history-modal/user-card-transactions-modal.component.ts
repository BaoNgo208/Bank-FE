import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CardTransactionsService } from '../../services/card-transactions.service';
import {
  CardTransactionPageResponse,
  CardTransactionStatus,
} from '../../../../card_transactions/types/type';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { dateRangeValidator } from '../../../../../utils/form-validator.util';
import { finalize } from 'rxjs';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../../../../utils/utc.util';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-user-card-transactions-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './user-card-transactions-modal.component.html',
})
export class UserCardTransactionsModalComponent implements OnChanges {
  @Input({ required: true }) userId!: number;
  @Input() displayName = '';

  @Output() closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private cardTransactionService = inject(CardTransactionsService);
  private cd = inject(ChangeDetectorRef);

  CardTransactionStatus = CardTransactionStatus;

  isSearching = false;

  transactionPage = 1;
  transactionPageSize = 15;
  transactionTotalItems = 0;

  searchForm = this.fb.group(
    {
      slashTransactionId: [''],
      merchantDescription: [''],
      status: [null as CardTransactionStatus | null],
      fromTime: [''],
      toTime: [''],
    },
    {
      validators: [dateRangeValidator],
    },
  );

  form = this.fb.group({
    rows: this.fb.array([]),
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.transactionPage = 1;
      this.isSearching = false;
      this.loadTransactions();
    }
  }

  loadTransactions(): void {
    this.cardTransactionService
      .getUserCardTransactions(this.userId, this.transactionPage - 1)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (res) => {
          const content = res.data.items;
          const total = res.data.total_size;

          this.transactionTotalItems = total;

          this.rows.clear();
          content.forEach((item: any) => this.rows.push(this.fb.group(item)));

          this.cd.detectChanges();
        },
        error: () => {
          this.clearTable();
        },
      });
  }

  onSearchClick(): void {
    if (this.searchForm.invalid) return;

    this.transactionPage = 1;
    this.isSearching = true;
    this.searchTransactions();
  }

  searchTransactions(): void {
    if (this.searchForm.invalid) return;

    const f = this.searchForm.value;

    this.cardTransactionService
      .getUserCardTransactions(this.userId, this.transactionPage - 1, {
        slashTransactionId: f.slashTransactionId?.trim() || undefined,
        merchantDescription: f.merchantDescription?.trim() || undefined,
        status: f.status ?? undefined,
        fromTime: toUtcStartOfDay(f.fromTime),
        toTime: toUtcEndOfDay(f.toTime),
      })
      .pipe(finalize(() => {}))
      .subscribe({
        next: (res) => {
          this.updateTable(res.data.items);
          this.transactionTotalItems = res.data.total_size;
          this.cd.markForCheck();
        },
        error: () => {
          this.clearTable();
        },
      });
  }

  onReset(): void {
    this.searchForm.reset({
      slashTransactionId: '',
      merchantDescription: '',
      status: null,
      fromTime: '',
      toTime: '',
    });

    this.transactionPage = 1;
    this.isSearching = false;
    this.loadTransactions();
  }

  onTransactionPageChange(page: number): void {
    this.transactionPage = page;

    if (this.isSearching) {
      this.searchTransactions();
    } else {
      this.loadTransactions();
    }
  }

  onTransactionPageSizeChange(pageSize: number): void {
    this.transactionPageSize = pageSize;
    this.transactionPage = 1;

    if (this.isSearching) {
      this.searchTransactions();
    } else {
      this.loadTransactions();
    }
  }

  updateTable(orders: any[]) {
    this.rows.clear();

    orders.forEach((trans) => {
      this.rows.push(
        this.fb.group({
          id: [trans.id],
          currency: [trans.currency],
          amount: [trans.amount],
          merchant_description: [trans.merchant_description],
          slash_transaction_id: [trans.slash_transaction_id],
          status: [trans.status],
          updated_at: [trans.updated_at],
        }),
      );
    });

    this.cd.detectChanges();
  }

  clearTable(): void {
    this.transactionTotalItems = 0;
    this.rows.clear();
  }

  copyAddressRecord(value: string | null | undefined): void {
    if (!value) return;

    navigator.clipboard.writeText(value);
  }

  close(): void {
    this.closed.emit();
  }
}
