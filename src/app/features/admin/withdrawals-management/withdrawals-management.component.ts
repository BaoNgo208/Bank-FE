import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AdminWithdrawalsFacade } from './facade/admin-withdrawals.facade';
import { WithdrawalsStore } from './store/widthdrawls.store';
import { WithdrawOrderStatus } from '../../wallet/types/wallet.type';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-withdrawals-management',
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, FormsModule],

  templateUrl: './withdrawals-management.component.html',
})
export class WithdrawalsManagementComponent {
  private fb = inject(FormBuilder);
  private withdrawalsFacade = inject(AdminWithdrawalsFacade);
  private cd = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);

  protected withdrawalsStore = inject(WithdrawalsStore);

  withdrawalsPage = 1;
  withdrawalsPageSize = 10;
  withdrawalsTotalItems = 0;

  openDropdownIndex: number | null = null;
  WithdrawOrderStatus = WithdrawOrderStatus;
  openNoteIndex: number | null = null;
  selectedStatus: WithdrawOrderStatus | null = null;
  adminNote: string = '';

  form = this.fb.group({
    withdrawalsRows: this.fb.array([]),
  });

  ngOnInit() {
    this.loadWithdrawalsPage();
  }

  openNoteInput(index: number, status: WithdrawOrderStatus) {
    this.openNoteIndex = index;
    this.selectedStatus = status;
    this.adminNote = '';

    this.openDropdownIndex = null;
  }

  toggleDropdown(i: number) {
    this.openDropdownIndex = this.openDropdownIndex === i ? null : i;
  }

  confirmUpdate(index: number, event: MouseEvent) {
    event.stopPropagation();
    if (!this.selectedStatus) return;
    const row = this.withdrawalsRows.at(index);
    const orderNo = row.get('order_no')?.value;

    const request = {
      status: this.selectedStatus,
      admin_note: this.adminNote,
    };

    this.withdrawalsFacade.updateWithdrawStatus(orderNo, request).subscribe({
      next: () => {
        row.patchValue({ status: this.selectedStatus });

        this.withdrawalsStore.updateStatus(orderNo, this.selectedStatus!);

        this.openNoteIndex = null;
        this.selectedStatus = null;
        this.openDropdownIndex = null;
        this.adminNote = '';

        this.cd.detectChanges();
        this.toast.success('Update order successfully');
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

  cancelNote() {
    this.openNoteIndex = null;
    this.selectedStatus = null;
    this.adminNote = '';
  }

  get withdrawalsRows(): FormArray {
    return this.form.get('withdrawalsRows') as FormArray;
  }

  private loadWithdrawalsPage(): void {
    this.withdrawalsFacade.getAllWithdrawOrders(this.withdrawalsPage - 1).subscribe((res) => {
      const content = res.data.items;
      const total = res.data.total_size;

      this.withdrawalsTotalItems = total;

      this.withdrawalsStore.setWithdrawals(content, total);

      this.withdrawalsRows.clear();
      content.forEach((item: any) => this.withdrawalsRows.push(this.fb.group(item)));

      this.cd.detectChanges();
    });
  }

  onWithdrawalsPageChange(page: number): void {
    this.withdrawalsPage = page;
    this.loadWithdrawalsPage();
  }
}
