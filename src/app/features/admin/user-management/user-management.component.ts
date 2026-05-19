import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { UsersService } from './services/users.service';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AccountStatus, AdminUserResponse } from './types/type';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { UserCardTransactionsModalComponent } from './components/card-transactions-history-modal/user-card-transactions-modal.component';
import { CashbackHistoryModal } from './components/cashback-history/cashback-history.component';

@Component({
  selector: 'app-user-management-component',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PaginationComponent,
    UserCardTransactionsModalComponent,
    CashbackHistoryModal,
  ],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent {
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  userPage = 1;
  userPageSize = 10;
  userTotalItems = 0;

  form = this.fb.group({
    rows: this.fb.array([]),
  });
  updateLimitForm = this.fb.group({
    card_open_limit: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
  });
  selectedUser: AdminUserResponse | null = null;

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }
  get cardOpenLimitCtrl() {
    return this.updateLimitForm.controls.card_open_limit;
  }

  AccountStatus = AccountStatus;

  openDropdownIndex: number | null = null;
  dropdownPosition = { top: 0, left: 0 };

  showUpdateLimitModal = false;
  isUpdatingLimit = false;

  showUserCardTransactionsModal = false;
  showUserCashbackHistory = signal<boolean>(false);

  ngOnInit() {
    this.loadUsersPage();
  }

  toggleUserLockStatus() {
    if (this.openDropdownIndex === null) return;

    const row = this.rows.at(this.openDropdownIndex);
    const user = row.value as AdminUserResponse;

    const isActive = user.status === AccountStatus.ACTIVE;

    const request$ = isActive
      ? this.usersService.lockUser(user.id)
      : this.usersService.unLockUser(user.id);

    request$.subscribe({
      next: () => {
        row.patchValue({
          status: isActive ? AccountStatus.LOCKED : AccountStatus.ACTIVE,
        });

        this.openDropdownIndex = null;
        this.cd.markForCheck();
      },
    });
  }

  isDropdownUserActive(): boolean {
    if (this.openDropdownIndex === null) return false;

    const user = this.rows.at(this.openDropdownIndex).value as AdminUserResponse;
    return user.status === AccountStatus.ACTIVE;
  }

  openUserCardTransactionsModal(): void {
    if (this.openDropdownIndex === null) return;

    const user = this.rows.at(this.openDropdownIndex).value as AdminUserResponse;

    if (!user) return;

    this.selectedUser = user;
    this.showUserCardTransactionsModal = true;

    this.openDropdownIndex = null;
  }

  openUserCashbackHistoryModal() {
    if (this.openDropdownIndex === null) return;
    const user = this.rows.at(this.openDropdownIndex).value as AdminUserResponse;

    if (!user) return;

    this.selectedUser = user;
    this.showUserCashbackHistory.set(true);
    this.openDropdownIndex = null;
  }

  closeUserCashbackHistoryModal() {
    this.showUserCashbackHistory.set(false);
    this.selectedUser = null;
  }

  closeUserCardTransactionsModal(): void {
    this.showUserCardTransactionsModal = false;
    this.selectedUser = null;
  }

  openUpdateCardLimitModal() {
    if (this.openDropdownIndex === null) return;

    const user = this.rows.at(this.openDropdownIndex).value as AdminUserResponse;

    if (!user) return;

    this.selectedUser = user;

    this.updateLimitForm.patchValue({
      card_open_limit: user.card_open_limit ?? 0,
    });

    this.updateLimitForm.markAsPristine();
    this.updateLimitForm.markAsUntouched();

    this.showUpdateLimitModal = true;
    this.openDropdownIndex = null;
  }

  closeUpdateCardLimitModal() {
    this.showUpdateLimitModal = false;
    this.selectedUser = null;
    this.updateLimitForm.reset({
      card_open_limit: 0,
    });
  }

  submitUpdateCardLimit() {
    if (this.updateLimitForm.invalid || !this.selectedUser) {
      this.updateLimitForm.markAllAsTouched();
      return;
    }

    const payload = {
      card_open_limit: this.updateLimitForm.value.card_open_limit!,
    };

    this.isUpdatingLimit = true;

    this.usersService.updateCardOpenLimit(this.selectedUser.id, payload).subscribe({
      next: () => {
        const index = this.rows.controls.findIndex((row) => row.value.id === this.selectedUser?.id);

        if (index !== -1) {
          this.rows.at(index).patchValue({
            card_open_limit: payload.card_open_limit,
          });
        }

        this.isUpdatingLimit = false;
        this.closeUpdateCardLimitModal();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isUpdatingLimit = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Update card open limit failed',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  toggleDropdown(i: number, event: MouseEvent) {
    event.stopPropagation();

    if (this.openDropdownIndex === i) {
      this.openDropdownIndex = null;
      return;
    }

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const dropdownWidth = 160;
    const dropdownHeight = 160;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const top =
      spaceBelow < dropdownHeight && spaceAbove > spaceBelow
        ? rect.top - dropdownHeight
        : rect.bottom;

    this.dropdownPosition = {
      top,
      left: rect.right - dropdownWidth,
    };
    this.openDropdownIndex = i;
  }

  onUserPageChange(page: number): void {
    this.userPage = page;
    this.loadUsersPage();
  }

  onUserPageSizeChange(size: number) {
    this.userPageSize = size;
    this.userPage = 1;
    this.loadUsersPage();
  }

  private loadUsersPage() {
    this.usersService.getUsers(this.userPage - 1).subscribe({
      next: (res) => {
        const content = res.data.items;
        this.userTotalItems = res.data.total_size;

        this.rows.clear();
        content.forEach((item: AdminUserResponse) => this.rows.push(this.fb.group({ ...item })));
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
