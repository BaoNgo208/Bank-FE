import { ChangeDetectorRef, Component, effect, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WalletFacade } from '../wallet/facades/wallet.facade';
import { CardListResponse } from '../wallet/types/wallet.type';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { InquiryUiStore } from './stores/inquiry-ui.store';
import { InquiryStore } from './stores/inquiry.store';
import Swal from 'sweetalert2';
import { TopUpModalComponent } from './components/top-up/topup-modal.component';
import { WidthdrawlCardModalComponent } from './components/widthdrawl/widthdrawl-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { CardFacade } from '../wallet/facades/card.facade';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-inquiry-card-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    TopUpModalComponent,
    WidthdrawlCardModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './inquiry-card.component.html',
})
export class InquiryCardComponent {
  private fb = inject(FormBuilder);
  private walletFacade = inject(WalletFacade);
  private cd = inject(ChangeDetectorRef);
  private inquiryStore = inject(InquiryStore);
  private cardFacade = inject(CardFacade);
  private toast = inject(ToastrService);

  protected inquiryUiStore = inject(InquiryUiStore);

  cardPage = 1;
  cardPageSize = 10;
  CardTotalItems = 0;
  isLoading = signal(false);

  openDropdownIndex: number | null = null;
  dropdownPosition = { top: 0, left: 0 };

  form = this.fb.group({
    checkAll: [false],
    rows: this.fb.array([]),
  });

  constructor() {
    effect(() => {
      const action = this.inquiryStore.cardActionResult();
      if (!action) return;

      const index = this.findRowIndex(action.cardId);
      if (index === -1) return;

      const control = this.rows.at(index);
      const current = control.value.remaining_amount ?? 0;
      let delta = 0;

      switch (action.type) {
        case 'TOP_UP':
          delta = action.amount;
          break;

        case 'WITHDRAW':
          delta = -action.amount;
          break;
      }
      const newAmount = (Math.round(current * 100) + Math.round(delta * 100)) / 100;

      this.updateRow(action.cardId, {
        remaining_amount: Math.max(0, newAmount),
      });

      this.inquiryStore.cardActionResult.set(null);
    });
  }

  @HostListener('document:click')
  onClickOutside() {
    this.openDropdownIndex = null;
  }

  private findRowIndex(cardId: number): number {
    return this.rows.controls.findIndex((c) => c.value.id === cardId);
  }

  private updateRow(cardId: number, data: Partial<any>) {
    const index = this.findRowIndex(cardId);
    if (index === -1) return;

    const control = this.rows.at(index);
    control.patchValue(data);
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

  handleAction(action: 'TOP_UP' | 'TRANSFER_OUT' | 'FREEZE' | 'CANCEL' | 'UNFREEZE') {
    const i = this.openDropdownIndex!;
    const row = this.rows.at(i).value;

    this.openDropdownIndex = null;

    switch (action) {
      case 'TOP_UP':
        this.inquiryUiStore.isTopUpModalOpen.set(true);
        this.inquiryStore.selectedCard.set(row);
        break;
      case 'TRANSFER_OUT':
        this.inquiryUiStore.isWidthdrawlOpen.set(true);
        this.inquiryStore.selectedCard.set(row);
        break;
      case 'FREEZE':
        this.inquiryUiStore.isConfirmFreezeOpen.set(true);
        this.inquiryStore.selectedCard.set(row);
        break;
      case 'UNFREEZE':
        this.inquiryUiStore.isConfirmFreezeOpen.set(true);
        this.inquiryStore.selectedCard.set(row);
        break;
      case 'CANCEL':
        this.updateCardStatus(row.id, 'CANCELED');
        break;
    }
  }

  handleFreezeCard() {
    const selectedCard = this.inquiryStore.selectedCard();
    this.isLoading.set(true);
    if (!selectedCard) return;

    const { id, status } = selectedCard;

    const isFreeze = status === 'ACTIVE';

    const action$ = isFreeze ? this.cardFacade.lockCard(id) : this.cardFacade.unlockCard(id);

    action$.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: () => {
        this.updateCardStatus(selectedCard.id, isFreeze ? 'BLOCKED' : 'ACTIVE');
        this.cd.detectChanges();
        this.toast.success(isFreeze ? 'Successfully froze card' : 'Successfully unfroze card');
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

  updateCardStatus(cardId: number, status: 'BLOCKED' | 'CANCELED' | 'ACTIVE') {
    const index = this.rows.controls.findIndex((r) => r.get('id')?.value === cardId);
    if (index !== -1) {
      this.rows.at(index).patchValue({ status });
    }
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit() {
    this.loadCardPage();
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
    this.walletFacade.getCards(this.cardPage - 1).subscribe({
      next: (res) => {
        const content = res.data.items;
        console.log(content);
        const total = res.data.total_size;
        this.CardTotalItems = total;
        this.rows.clear();
        content.forEach((item: CardListResponse) =>
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
