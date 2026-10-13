import { Component, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from './services/deposit.service';
import { DepositOrderListAdminResponse, DepositOrderStatus } from './types/deposit.type';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { dateRangeValidator } from '../../../utils/form-validator.util';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../../utils/utc.util';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'admin-deposit-orders-component',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, ConfirmModalComponent],
  templateUrl: './deposit-orders.component.html',
})
export class DepositOrdersComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private toast = inject(ToastrService);
  private depositService = inject(DepositService);
  private loadSubscription?: Subscription;
  private readonly BLOCK_UPDATE_STATUSES = new Set<DepositOrderStatus>([
    DepositOrderStatus.SUCCESS,
    DepositOrderStatus.FAILED,
  ]);

  @HostListener('document:click')
  onDocumentClick() {
    this.openDropdownIndex = null;
  }

  depositPage = 1;

  depositPageSize = 15;
  depositTotalItems = signal(0);
  orders = signal<DepositOrderListAdminResponse[]>([]);
  isLoading = signal(false);

  openNoteIndex: number | null = null;
  DepositOrderStatus = DepositOrderStatus;
  selectedStatus: DepositOrderStatus | null = null;
  dropdownPosition = { top: 0, left: 0 };
  notePosition = {
    top: 0,
    left: 0,
  };
  openDropdownIndex: number | null = null;
  adminNote: string = '';
  isSearching = false;

  showImageModal = false;
  selectedImageUrls: string[] = [];
  showConfirmModal = signal(false);

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
    this.loadOrdersPage();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  openImageUrlsModal(value: string | string[] | null | undefined): void {
    this.selectedImageUrls = this.parseImageUrls(value);
    this.showImageModal = true;
  }

  closeImageUrlsModal(): void {
    this.showImageModal = false;
    this.selectedImageUrls = [];
  }

  private parseImageUrls(value: string | string[] | null | undefined): string[] {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    return value
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);
  }

  onSearchClick() {
    this.depositPage = 1;
    this.onSearch();
  }

  onSearch() {
    this.isSearching = true;
    this.loadOrdersPage();
  }

  copyImageUrlsRecord(value: string | null | undefined) {
    if (!value) return;

    navigator.clipboard.writeText(value);

    this.toast.success('Copied to clipboard');
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
    this.depositPage = 1;

    this.loadOrdersPage();
  }

  displayConfirmModal() {
    this.showConfirmModal.set(true);
  }

  handleConfirmUpdate = () => {
    const index = this.openNoteIndex;

    if (index === null) return;

    this.confirmUpdate(index);
  };

  confirmUpdate(index: number, event?: MouseEvent) {
    event?.stopPropagation();
    if (!this.selectedStatus) return;
    const order = this.orders()[index];

    if (!order) return;

    const orderNo = order.order_no;
    const status = this.selectedStatus;

    const request = {
      status,
      admin_note: this.adminNote,
    };

    this.depositService.updateDepositStatus(orderNo, request).subscribe({
      next: () => {
        this.orders.update((orders) =>
          orders.map((item) => (item.order_no === orderNo ? { ...item, status } : item)),
        );

        this.openNoteIndex = null;
        this.selectedStatus = null;
        this.openDropdownIndex = null;
        this.adminNote = '';

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

  openNoteInput(index: number, status: DepositOrderStatus, event: MouseEvent): void {
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

    const status = this.orders()[index]?.status;

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
  onDepositPageChange(page: number): void {
    this.depositPage = page;
    this.loadOrdersPage();
  }

  onDepositPageSizeChange(size: number) {
    this.depositPageSize = size;
    this.depositPage = 1;
    this.loadOrdersPage();
  }

  private loadOrdersPage(): void {
    const formValue = this.searchForm.value;
    const filters = this.isSearching
      ? {
          orderNo: formValue.orderNo ?? undefined,
          username: formValue.username ?? undefined,
          status: formValue.status ?? undefined,
          fromTime: toUtcStartOfDay(formValue.fromTime),
          toTime: toUtcEndOfDay(formValue.toTime),
        }
      : undefined;

    // Prevent an older response from overwriting the latest table state.
    this.loadSubscription?.unsubscribe();
    this.isLoading.set(true);

    this.loadSubscription = this.depositService
      .getAllDepositOrders(this.depositPage - 1, filters)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.orders.set(res.data.items ?? []);
          this.depositTotalItems.set(res.data.total_size ?? 0);
        },
        error: (err) => {
          this.orders.set([]);
          this.depositTotalItems.set(0);
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
