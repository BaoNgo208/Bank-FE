import { ChangeDetectorRef, Component, HostListener, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from './services/deposit.service';
import { DepositOrderListAdminResponse, DepositOrderStatus } from './types/deposit.type';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { dateRangeValidator } from '../../../utils/form-validator.util';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../../utils/utc.util';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'admin-deposit-orders-component',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, ConfirmModalComponent],
  templateUrl: './deposit-orders.component.html',
})
export class DepositOrdersComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);
  private depositService = inject(DepositService);

  @HostListener('document:click')
  onDocumentClick() {
    this.openDropdownIndex = null;
  }

  depositPage = 1;

  depositPageSize = 15;
  depositTotalItems = 0;

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

  form = this.fb.group({
    rows: this.fb.array([]),
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

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit() {
    this.loadOrdersPage();
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

    const f = this.searchForm.value;

    this.depositService
      .getAllDepositOrders(this.depositPage - 1, {
        orderNo: f.orderNo ?? undefined,
        username: f.username ?? undefined,
        status: f.status ?? undefined,
        fromTime: toUtcStartOfDay(f.fromTime),
        toTime: toUtcEndOfDay(f.toTime),
      })
      .subscribe({
        next: (res) => {
          this.updateTable(res.data.items);
          this.depositTotalItems = res.data.total_size;
          this.cd.markForCheck();
        },
      });
  }

  copyImageUrlsRecord(value: string | null | undefined) {
    if (!value) return;

    navigator.clipboard.writeText(value);

    this.toast.success('Copied to clipboard');
  }

  updateTable(orders: any[]) {
    this.rows.clear();

    orders.forEach((trans) => {
      this.rows.push(
        this.fb.group({
          username: [trans.username],
          user_id: [trans.user_id],
          expected_amount: [trans.expected_amount],
          deposit_address: [trans.deposit_address],
          fee: [trans.fee],
          updated_at: [trans.updated_at],
          currency: [trans.currency],
          amount: [trans.amount],
          order_no: [trans.order_no],
          network: [trans.network],
          status: [trans.status],
          image_urls: [trans.image_urls],
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
    this.depositPage = 1;

    // this.cd.detectChanges();
    this.loadOrdersPage();
  }

  displayConfirmModal() {
    this.showConfirmModal.set(true);
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
    const row = this.rows.at(index);
    const orderNo = row.get('order_no')?.value;

    const request = {
      status: this.selectedStatus,
      admin_note: this.adminNote,
    };

    this.depositService.updateDepositStatus(orderNo, request).subscribe({
      next: () => {
        row.patchValue({ status: this.selectedStatus });

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

  private loadOrdersPage() {
    this.depositService.getAllDepositOrders(this.depositPage - 1).subscribe({
      next: (res) => {
        const content = res.data.items;
        this.depositTotalItems = res.data.total_size;

        this.rows.clear();
        content.forEach((item: DepositOrderListAdminResponse) =>
          this.rows.push(this.fb.group({ ...item })),
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
