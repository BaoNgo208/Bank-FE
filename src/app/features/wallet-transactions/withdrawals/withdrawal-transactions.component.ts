import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WalletFacade } from '../../wallet/facades/wallet.facade';
import { ToastrService } from 'ngx-toastr';
import { WithdrawOrderStatus } from '../../wallet/types/wallet.type';
import { dateRangeValidator } from '../../../utils/form-validator.util';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../../utils/utc.util';

@Component({
  selector: 'app-withdrawal-transaction',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, PaginationComponent],
  templateUrl: './withdrawal-transactions.component.html',
})
export class WithdrawalTransactionComponent {
  @Input() isPagination = true;

  private fb = inject(FormBuilder);
  private walletFacade = inject(WalletFacade);
  private cd = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);

  transferPage = 1;
  transferPageSize = 10;
  transferTotalItems = 0;
  WithdrawOrderStatus = WithdrawOrderStatus;
  isSearching = false;

  form = this.fb.group({
    transferRows: this.fb.array([]),
  });

  searchForm = this.fb.group(
    {
      orderNo: [''],
      address: [''],
      status: [null],
      fromTime: [null],
      toTime: [null],
    },
    { validators: dateRangeValidator },
  );

  get transferRows(): FormArray {
    return this.form.get('transferRows') as FormArray;
  }

  ngOnInit() {
    this.loadTransferPage();
  }

  updateTable(orders: any[]) {
    this.transferRows.clear();

    orders.forEach((order) => {
      this.transferRows.push(
        this.fb.group({
          order_no: [order.order_no],
          currency: [order.currency],
          network: [order.network],
          to_address: [order.to_address],
          amount: [order.amount],
          status: [order.status],
          created_at: [order.created_at],
        }),
      );
    });

    this.cd.detectChanges();
  }

  copyAddressRecord(value: string | null | undefined) {
    if (!value) return;

    navigator.clipboard.writeText(value);

    this.toast.success('Copied to clipboard');
  }

  onReset() {
    this.isSearching = false;
    // 1. Reset form
    this.searchForm.reset({
      orderNo: '',
      address: '',
      status: null,
      fromTime: null,
      toTime: null,
    });

    // 2. Reset page về 1
    this.transferPage = 1;

    // this.cd.detectChanges();
    this.loadTransferPage();
  }

  onSearchClick(): void {
    this.transferPage = 1;
    this.onSearch();
  }

  onSearch() {
    this.isSearching = true;
    const f = this.searchForm.value;

    this.walletFacade
      .searchWidthdrawlOrders(this.transferPage - 1, {
        orderNo: f.orderNo ?? undefined,
        address: f.address ?? undefined,
        status: f.status ?? undefined,
        fromTime: toUtcStartOfDay(f.fromTime),
        toTime: toUtcEndOfDay(f.toTime),
      })
      .subscribe({
        next: (res) => {
          this.updateTable(res.data.items);
          this.transferTotalItems = res.data.total_size;
          this.cd.markForCheck();
        },
      });
  }

  onTransferPageChange(page: number): void {
    this.transferPage = page;
    if (this.isSearching) {
      this.onSearch();
    } else {
      this.loadTransferPage();
    }

    this.cd.markForCheck();
  }

  onTransferPageSizeChange(size: number): void {
    this.transferPageSize = size;
    this.transferPage = 1;
    this.loadTransferPage();
  }

  private loadTransferPage(): void {
    this.walletFacade.getWithdrawOrders(this.transferPage - 1).subscribe((res) => {
      const content = this.isPagination ? res.data.items : res.data.items.slice(0, 5);

      const total = res.data.total_size;

      this.transferTotalItems = total;

      this.transferRows.clear();
      content.forEach((item: any) => this.transferRows.push(this.fb.group(item)));

      this.cd.detectChanges();
    });
  }
}
