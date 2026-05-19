import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WalletFacade } from '../../wallet/facades/wallet.facade';
import { ToastrService } from 'ngx-toastr';
import { dateRangeValidator } from '../../../utils/form-validator.util';
import { DepositOrderStatus } from '../../admin/deposit-orders-management/types/deposit.type';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../../utils/utc.util';

@Component({
  selector: 'app-widthdrawal-list-component',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './deposit-transactions.component.html',
})
export class DepositTransactionsComponent {
  @Input() isPagination = true;

  private fb = inject(FormBuilder);
  private walletFacade = inject(WalletFacade);
  private cd = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);

  rechargePage = 1;
  rechargePageSize = 10;
  rechargeTotalItems = 0;
  isSearching = false;

  form = this.fb.group({
    rechargeRows: this.fb.array([]),
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

  DepositOrderStatus = DepositOrderStatus;

  get rechargeRows(): FormArray {
    return this.form.get('rechargeRows') as FormArray;
  }

  ngOnInit() {
    this.loadRechargePage();
  }

  onSearchClick(): void {
    this.rechargePage = 1;
    this.onSearch();
  }

  onSearch() {
    this.isSearching = true;
    const f = this.searchForm.value;

    this.walletFacade
      .searchDepositOrders(this.rechargePage - 1, {
        orderNo: f.orderNo ?? undefined,
        address: f.address ?? undefined,
        status: f.status ?? undefined,
        fromTime: toUtcStartOfDay(f.fromTime),
        toTime: toUtcEndOfDay(f.toTime),
      })
      .subscribe({
        next: (res) => {
          this.updateTable(res.data.items);
          this.rechargeTotalItems = res.data.total_size;
          this.cd.markForCheck();
        },
      });
  }

  updateTable(orders: any[]) {
    this.rechargeRows.clear();

    orders.forEach((order) => {
      this.rechargeRows.push(
        this.fb.group({
          order_no: [order.order_no],
          currency: [order.currency],
          network: [order.network],
          address: [order.address],
          amount: [order.amount],
          expected_amount: [order.expected_amount],
          status: [order.status],
          admin_note: [order.admin_note],
          created_at: [order.created_at],
        }),
      );
    });

    this.cd.detectChanges();
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
    this.rechargePage = 1;

    // this.cd.detectChanges();
    this.loadRechargePage();
  }

  addOptimisticOrder(order: any): void {
    this.rechargeRows.insert(
      0,
      this.fb.group({
        ...order,
        admin_note: order.admin_note ?? null,
        created_at: order.created_at ?? new Date().toISOString(),
      }),
    );

    this.rechargeTotalItems++;
    this.cd.detectChanges();
  }

  copyAddressRecord(value: string | null | undefined) {
    if (!value) return;

    navigator.clipboard.writeText(value);

    this.toast.success('Copied to clipboard');
  }

  onRechargePageChange(page: number): void {
    this.rechargePage = page;
    this.loadRechargePage();
  }
  onRechargePageSizeChange(size: number): void {
    this.rechargePageSize = size;
    this.rechargePage = 1;
    this.loadRechargePage();
  }

  private loadRechargePage(): void {
    this.walletFacade.getDepositOrders(this.rechargePage - 1).subscribe((res) => {
      const content = this.isPagination ? res.data.items : res.data.items.slice(0, 5);
      const total = res.data.total_size;

      this.rechargeTotalItems = total;

      this.rechargeRows.clear();
      content.forEach((item: any) => this.rechargeRows.push(this.fb.group(item)));

      this.cd.detectChanges();
    });
  }
}
