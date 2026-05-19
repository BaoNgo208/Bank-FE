import { ChangeDetectorRef, Component, HostListener, inject, signal } from '@angular/core';
import { CashbackService } from '../../services/cashback.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CashbackStore } from '../../stores/cashback.store';
import { ApproveCashbackBatchRequest, CashbackRefundResponse } from '../../types/type';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { finalize } from 'rxjs';

type CashbackConfirmAction = 'approve' | 'reject';

@Component({
  selector: 'app-pending-cashback-component',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './pending-cashbacks.component.html',
})
export class PendingCashbacksComponent {
  private cashbackService = inject(CashbackService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  protected cashbackStore = inject(CashbackStore);

  pendingPage = 1;
  pendingPageSize = 10;
  pendingTotalItems = 0;

  openDropdownIndex: number | null = null;

  selectedUserIds = signal<number[]>([]);

  confirmAction = signal<CashbackConfirmAction>('approve');

  showCashbackConfirmModal = signal(false);

  month = this.fb.nonNullable.control(this.getCurrentMonth());

  getCurrentMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  onMonthChange() {
    this.loadPendingPage();
  }

  form = this.fb.group({
    rows: this.fb.array([]),
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  get formGroups(): FormGroup[] {
    return this.rows.controls as FormGroup[];
  }

  get isAllSelected(): boolean {
    return (
      this.rows.length > 0 && this.formGroups.every((row) => row.get('selected')?.value === true)
    );
  }

  get isSomeSelected(): boolean {
    return this.formGroups.some((row) => row.get('selected')?.value === true);
  }

  ngOnInit() {
    this.loadPendingPage();
  }

  @HostListener('document:click')
  closeDropdown() {
    this.openDropdownIndex = null;
  }

  openApproveConfirmModal() {
    this.confirmAction.set('approve');
    this.showCashbackConfirmModal.set(true);
  }

  openRejectConfirmModal() {
    this.confirmAction.set('reject');
    this.showCashbackConfirmModal.set(true);
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    const pageUserIds = this.formGroups
      .map((row) => row.get('user_id')?.value)
      .filter((id) => id != null);

    this.formGroups.forEach((row) => {
      row.get('selected')?.setValue(checked, { emitEvent: false });
    });

    this.selectedUserIds.update((ids) => {
      if (checked) {
        return Array.from(new Set([...ids, ...pageUserIds]));
      }

      return ids.filter((id) => !pageUserIds.includes(id));
    });

    this.cd.detectChanges();
  }

  toggleOne(row: FormGroup) {
    this.updateSelectedUserIds(row);
  }

  private updateSelectedUserIds(row: FormGroup) {
    const userId = row.get('user_id')?.value;
    const checked = row.get('selected')?.value === true;

    if (userId == null) return;

    this.selectedUserIds.update((ids) => {
      if (checked) {
        return ids.includes(userId) ? ids : [...ids, userId];
      }

      return ids.filter((id) => id !== userId);
    });
  }

  confirmCashbackAction() {
    const action = this.confirmAction();
    const userIds = this.selectedUserIds();

    if (userIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select at least one user',
      });
      return;
    }

    const request: ApproveCashbackBatchRequest = {
      user_ids: userIds,
    };

    const actionRequest$ =
      action === 'approve'
        ? this.cashbackService.approveCashbackBatch(this.month.value, request)
        : this.cashbackService.rejectCashbackBatch(this.month.value, request);

    actionRequest$
      .pipe(
        finalize(() => {
          this.showCashbackConfirmModal.set(false);
        }),
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text:
              action === 'approve'
                ? 'Approve cashback successfully'
                : 'Reject cashback successfully',
          });

          this.loadPendingPage();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Something went wrong',
          });
        },
      });
  }

  onPendingPageChange(page: number): void {
    this.pendingPage = page;
    this.loadPendingPage();
  }

  onPendingPageSizeChange(size: number) {
    this.pendingPageSize = size;
    this.pendingPage = 1;
    this.loadPendingPage();
  }

  private loadPendingPage() {
    this.cashbackService.getPendingCashback(this.month.value, this.pendingPage - 1).subscribe({
      next: (res) => {
        const content = res.data.items;
        this.pendingTotalItems = res.data.total_size;
        const selectedIds = this.selectedUserIds();

        this.rows.clear();
        content.forEach((item: CashbackRefundResponse) =>
          this.rows.push(
            this.fb.group({ selected: [selectedIds.includes(item.user_id)], ...item }),
          ),
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
