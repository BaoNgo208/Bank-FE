import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InquiryStore } from '../../inquiry-card/stores/inquiry.store';
import { ToastrService } from 'ngx-toastr';
import { InquiryUiStore } from '../../inquiry-card/stores/inquiry-ui.store';
import { CardStatus } from '../../wallet/types/wallet.type';
import { dateRangeValidator } from '../../../utils/form-validator.util';
import { AdminCardService } from './services/admin-card.service';
import { toUtcEndOfDay, toUtcStartOfDay } from '../../../utils/utc.util';
import Swal from 'sweetalert2';
import { AdminCardListResponse } from './types/admin-card.type';

@Component({
  selector: 'app-card-management-commponent',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './card-management.component.html',
})
export class CardManagementComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private inquiryStore = inject(InquiryStore);
  private toast = inject(ToastrService);
  private adminCardService = inject(AdminCardService);

  cardPage = 1;
  cardPageSize = 10;
  CardTotalItems = 0;
  isLoading = signal(false);
  CardStatus = CardStatus;

  openDropdownIndex: number | null = null;
  dropdownPosition = { top: 0, left: 0 };

  form = this.fb.group({
    checkAll: [false],
    rows: this.fb.array([]),
  });

  searchForm = this.fb.group(
    {
      cardNumber: [''],
      cardName: [''],
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
    this.loadCardPage();
  }

  @HostListener('document:click')
  onClickOutside() {
    this.openDropdownIndex = null;
  }

  updateTable(cards: any[]) {
    this.rows.clear();

    cards.forEach((card) => {
      this.rows.push(
        this.fb.group({
          id: [card.id],
          masked_card: [card.masked_card],
          brand: [card.brand],
          name: [card.name],
          currency: [card.currency],
          status: [card.status],
          remaining_amount: [card.remaining_amount],
          created_at: [card.created_at],
          note: [card.note],
          selected: [false],
        }),
      );
    });
    this.cd.detectChanges();
  }

  onSearch() {
    const f = this.searchForm.value;

    this.adminCardService
      .getAdminCards(this.cardPage - 1, {
        cardNumber: f.cardNumber ?? undefined,
        cardName: f.cardName ?? undefined,
        username: f.username ?? undefined,
        status: f.status ?? undefined,
        fromTime: toUtcStartOfDay(f.fromTime),
        toTime: toUtcEndOfDay(f.toTime),
      })
      .subscribe({
        next: (res) => {
          this.updateTable(res.data.items);
          this.CardTotalItems = res.data.total_size;
          this.cd.markForCheck();
        },
      });
  }

  onReset() {
    this.searchForm.reset({
      cardNumber: '',
      cardName: '',
      username: '',
      status: null,
      fromTime: null,
      toTime: null,
    });

    this.cardPage = 1;

    this.loadCardPage();
  }

  private findRowIndex(cardId: number): number {
    return this.rows.controls.findIndex((c: any) => c.value.id === cardId);
  }

  toggleDropdown(i: number, event: MouseEvent): void {
    event.stopPropagation();

    if (this.openDropdownIndex === i) {
      this.openDropdownIndex = null;
      return;
    }

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();

    const dropdownWidth = 160;
    const dropdownHeight = 44;

    const gap = 6;
    const padding = 8;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldOpenAbove = spaceBelow < dropdownHeight + gap && spaceAbove > spaceBelow;

    const top = shouldOpenAbove ? rect.top - dropdownHeight - gap : rect.bottom + gap;

    const left = rect.right - dropdownWidth;

    this.dropdownPosition = {
      top: Math.max(padding, Math.min(top, window.innerHeight - dropdownHeight - padding)),
      left: Math.max(padding, Math.min(left, window.innerWidth - dropdownWidth - padding)),
    };

    this.openDropdownIndex = i;
  }

  updateCardStatus(cardId: number, status: 'BLOCKED' | 'CANCELED' | 'ACTIVE') {
    const index = this.rows.controls.findIndex((r: any) => r.get('id')?.value === cardId);
    if (index !== -1) {
      this.rows.at(index).patchValue({ status });
    }
  }

  toggleCardLockStatus(): void {
    if (this.openDropdownIndex === null) return;

    const row = this.rows.at(this.openDropdownIndex);
    const cardId = row.get('id')?.value;
    const currentStatus = row.get('status')?.value as CardStatus;

    if (!cardId) return;

    const previousStatus = currentStatus;
    const nextStatus = currentStatus === CardStatus.ACTIVE ? CardStatus.BLOCKED : CardStatus.ACTIVE;

    // optimistic update
    row.patchValue({
      status: nextStatus,
    });

    this.openDropdownIndex = null;
    this.cd.markForCheck();

    const request$ =
      currentStatus === CardStatus.ACTIVE
        ? this.adminCardService.lockCard(cardId)
        : this.adminCardService.unlockCard(cardId);

    request$.subscribe({
      next: () => {
        this.cd.markForCheck();
      },
      error: (err) => {
        row.patchValue({
          status: previousStatus,
        });

        this.cd.markForCheck();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Update card status failed',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  toggleAll() {
    const checked = this.form.value.checkAll;
    this.rows.controls.forEach((row) => row.get('selected')?.setValue(checked));
  }

  onCardPageChange(page: number) {
    this.cardPage = page;
    this.loadCardPage();
  }

  onCardPageSizeChange(size: number) {
    this.cardPageSize = size;
    this.cardPage = 1;
    this.loadCardPage();
  }

  private loadCardPage() {
    this.adminCardService.getAdminCards(this.cardPage - 1).subscribe({
      next: (res) => {
        const content = res.data.items;
        const total = res.data.total_size;
        this.CardTotalItems = total;
        this.rows.clear();
        content.forEach((item: AdminCardListResponse) =>
          this.rows.push(this.fb.group({ ...item, selected: [false] })),
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
