import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WalletFacade } from '../../wallet/facades/wallet.facade';
import { ToastrService } from 'ngx-toastr';

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

  form = this.fb.group({
    rechargeRows: this.fb.array([]),
    transferRows: this.fb.array([]),
  });

  get rechargeRows(): FormArray {
    return this.form.get('rechargeRows') as FormArray;
  }

  ngOnInit() {
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
