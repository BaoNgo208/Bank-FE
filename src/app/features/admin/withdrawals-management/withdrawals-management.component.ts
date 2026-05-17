import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, HostListener, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AdminWithdrawalsFacade } from './facade/admin-withdrawals.facade';
import { WithdrawalsStore } from './store/widthdrawls.store';
import { WithdrawOrderStatus } from '../../wallet/types/wallet.type';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AdminWithdrawalsService } from './service/admin-widthdrawals.service';
import { dateRangeValidator } from '../../../utils/form-validator.util';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../../utils/utc.util';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-withdrawals-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    FormsModule,
    ConfirmModalComponent,
  ],

  templateUrl: './withdrawals-management.component.html',
})
export class WithdrawalsManagementComponent {
  private fb = inject(FormBuilder);
  private adminWithdrawalsService = inject(AdminWithdrawalsService);
  private cd = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);
  private readonly BLOCK_UPDATE_STATUSES = new Set<WithdrawOrderStatus>([
    WithdrawOrderStatus.SUCCESS,
    WithdrawOrderStatus.FAILED,
  ]);

  protected withdrawalsStore = inject(WithdrawalsStore);

  @HostListener('document:click')
  onDocumentClick() {
    this.openDropdownIndex = null;
  }

  withdrawalsPage = 1;
  withdrawalsPageSize = 15;
  withdrawalsTotalItems = 0;
  isSearching = false;

  showConfirmModal = signal(false);

  openDropdownIndex: number | null = null;
  WithdrawOrderStatus = WithdrawOrderStatus;
  openNoteIndex: number | null = null;
  selectedStatus: WithdrawOrderStatus | null = null;
  adminNote: string = '';

  dropdownPosition = { top: 0, left: 0 };
  notePosition = {
    top: 0,
    left: 0,
  };

  form = this.fb.group({
    withdrawalsRows: this.fb.array([]),
  });
  searchForm = this.fb.group(
    {
      orderNo: [''],
      username: [''],
      status: [null],
      fromTime: [null],
      toTime: [null],
    },
    { validators: dateRangeValidator },
  );

  ngOnInit() {
    this.loadWithdrawalsPage();
  }

  onSearchClick() {
    this.withdrawalsPage = 1;
    this.onSearch();
  }

  onSearch() {
    this.isSearching = true;

    const f = this.searchForm.value;

    this.adminWithdrawalsService
      .getAllWithdrawOrders(this.withdrawalsPage - 1, {
        orderNo: f.orderNo ?? undefined,
        username: f.username ?? undefined,
        status: f.status ?? undefined,
        fromTime: toUtcStartOfDay(f.fromTime),
        toTime: toUtcEndOfDay(f.toTime),
      })
      .subscribe({
        next: (res) => {
          this.updateTable(res.data.items);
          this.withdrawalsTotalItems = res.data.total_size;
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
    this.withdrawalsRows.clear();

    orders.forEach((trans) => {
      this.withdrawalsRows.push(
        this.fb.group({
          username: [trans.username],
          currency: [trans.currency],
          amount: [trans.amount],
          order_no: [trans.order_no],
          network: [trans.network],
          status: [trans.status],
          created_at: [trans.created_at],
          to_address: [trans.to_address],
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
      username: '',
      status: null,
      fromTime: null,
      toTime: null,
    });

    // 2. Reset page về 1
    this.withdrawalsPage = 1;

    // this.cd.detectChanges();
    this.loadWithdrawalsPage();
  }

  openNoteInput(index: number, status: WithdrawOrderStatus, event: MouseEvent): void {
    event.stopPropagation();

    this.openDropdownIndex = null;
    this.openNoteIndex = index;
    this.selectedStatus = status;
    this.adminNote = '';

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.notePosition = {
      top: rect.bottom + 6,
      left: rect.right - 288,
    };
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation();

    const row = this.withdrawalsRows.at(index);
    const status = row.get('status')?.value as WithdrawOrderStatus | null;

    if (status && this.BLOCK_UPDATE_STATUSES.has(status)) {
      this.openDropdownIndex = null;
      this.openNoteIndex = null;
      return;
    }

    if (this.openDropdownIndex === index) {
      this.openDropdownIndex = null;
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.openDropdownIndex = index;
    this.openNoteIndex = null;

    this.dropdownPosition = {
      top: rect.bottom + 6,
      left: rect.right - 128,
    };
  }

  handleConfirmUpdate = () => {
    const index = this.openNoteIndex;

    if (index === null) {
      return;
    }

    this.confirmUpdate(index);
  };

  confirmUpdate(index: number, event?: MouseEvent) {
    event?.stopPropagation();
    if (!this.selectedStatus) return;
    const row = this.withdrawalsRows.at(index);
    const orderNo = row.get('order_no')?.value;

    const request = {
      status: this.selectedStatus,
      admin_note: this.adminNote,
    };

    this.adminWithdrawalsService.updateWithdrawStatus(orderNo, request).subscribe({
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
    this.adminWithdrawalsService.getAllWithdrawOrders(this.withdrawalsPage - 1).subscribe((res) => {
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
    if (this.isSearching) {
      this.onSearch();
    } else {
      this.loadWithdrawalsPage();
    }
  }
}
