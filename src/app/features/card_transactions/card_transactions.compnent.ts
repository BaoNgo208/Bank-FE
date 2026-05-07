import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CardTransactionService } from './services/card-transaction.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { dateRangeValidator } from '../../utils/form-validator.util';
import { CardTransactionStatus } from './types/type';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../utils/utc.util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction-records-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './card_transactions.component.html',
})
export class CardTransactionsComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private cardTransactionService = inject(CardTransactionService);
  private toast = inject(ToastrService);

  transactionPage = 1;
  transactionPageSize = 15;
  transactionTotalItems = 0;
  CardTransactionStatus = CardTransactionStatus;
  isSearching = false;

  form = this.fb.group({
    rows: this.fb.array([]),
  });
  searchForm = this.fb.group(
    {
      slashTransactionId: [''],
      merchantDescription: [''],
      status: [null],
      fromTime: [null],
      toTime: [null],
    },
    { validators: dateRangeValidator },
  );

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit() {
    this.loadPage();
  }

  onTransactionPageChange(page: number): void {
    this.transactionPage = page;
    if (this.isSearching) {
      this.onSearch();
    } else {
      this.loadPage();
    }
  }
  onTransactionPageSizeChange(size: number): void {
    this.transactionPageSize = size;
    this.transactionPage = 1;
    this.loadPage();
  }

  onSearchClick() {
    this.transactionPage = 1;
    this.onSearch();
  }

  onSearch() {
    this.isSearching = true;

    const f = this.searchForm.value;

    this.cardTransactionService
      .getCardTransactions(this.transactionPage - 1, {
        slashTransactionId: f.slashTransactionId ?? undefined,
        merchantDescription: f.merchantDescription ?? undefined,
        status: f.status ?? undefined,
        fromTime: toUtcStartOfDay(f.fromTime),
        toTime: toUtcEndOfDay(f.toTime),
      })
      .subscribe({
        next: (res) => {
          this.updateTable(res.data.items);
          this.transactionTotalItems = res.data.total_size;
          this.cd.markForCheck();
        },
      });
  }

  copyAddressRecord(value: string | null | undefined) {
    if (!value) return;

    navigator.clipboard.writeText(value);

    this.toast.success('Copied to clipboard');
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

  onReset() {
    this.isSearching = false;

    // 1. Reset form
    this.searchForm.reset({
      slashTransactionId: '',
      merchantDescription: '',
      status: null,
      fromTime: null,
      toTime: null,
    });

    // 2. Reset page về 1
    this.transactionPage = 1;

    // this.cd.detectChanges();
    this.loadPage();
  }

  private loadPage(): void {
    this.cardTransactionService.getCardTransactions(this.transactionPage - 1).subscribe((res) => {
      const content = res.data.items;
      const total = res.data.total_size;

      this.transactionTotalItems = total;

      this.rows.clear();
      content.forEach((item: any) => this.rows.push(this.fb.group(item)));

      this.cd.detectChanges();
    });
  }
}
