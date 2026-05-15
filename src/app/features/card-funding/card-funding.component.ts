import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CardTransactionService } from '../card_transactions/services/card-transaction.service';
import { ToastrService } from 'ngx-toastr';
import { dateRangeValidator } from '../../utils/form-validator.util';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../utils/utc.util';
import {
  CardFundingTransactionItemResponse,
  CardTxnStatus,
  CardTxnType,
} from './types/card-funding.type';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-card-funding-component',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './card-funding.component.html',
})
export class CardFundingComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private cardTransactionService = inject(CardTransactionService);
  private toast = inject(ToastrService);

  transactionPage = 1;
  transactionPageSize = 15;
  transactionTotalItems = 0;
  isSearching = false;

  CardTxnStatus = CardTxnStatus;
  CardTxnType = CardTxnType;

  form = this.fb.group({
    rows: this.fb.array([]),
  });
  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  searchForm = this.fb.group(
    {
      last4: [''],
      type: [null as CardTxnType | null],
      status: [null as CardTxnStatus | null],
      fromTime: [null],
      toTime: [null],
    },
    { validators: dateRangeValidator },
  );
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

  updateTable(transactions: CardFundingTransactionItemResponse[]) {
    this.rows.clear();

    transactions.forEach((trans) => {
      this.rows.push(
        this.fb.group({
          card_id: [trans.card_id],
          type: [trans.type],
          amount: [trans.amount],
          status: [trans.status],
          created_at: [trans.created_at],
        }),
      );
    });

    this.cd.detectChanges();
  }

  onSearchClick() {
    this.transactionPage = 1;
    this.onSearch();
  }

  onReset() {
    this.isSearching = false;

    // 1. Reset form
    this.searchForm.reset({
      last4: '',
      type: CardTxnType.TOPUP,
      status: null,
      fromTime: null,
      toTime: null,
    });

    // 2. Reset page về 1
    this.transactionPage = 1;

    // this.cd.detectChanges();
    this.loadPage();
  }

  onSearch() {
    this.isSearching = true;

    const f = this.searchForm.value;

    this.cardTransactionService
      .getFundingTransactions(this.transactionPage - 1, {
        last4: f.last4 ?? undefined,
        type: f.type ?? undefined,
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

  private loadPage(): void {
    this.cardTransactionService
      .getFundingTransactions(this.transactionPage - 1)
      .subscribe((res) => {
        const content = res.data.items;
        const total = res.data.total_size;

        this.transactionTotalItems = total;

        this.rows.clear();
        content.forEach((item: any) => this.rows.push(this.fb.group(item)));

        this.cd.detectChanges();
      });
  }
}
