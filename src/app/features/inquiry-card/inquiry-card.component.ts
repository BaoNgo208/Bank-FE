import {
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { WalletFacade } from '../wallet/facades/wallet.facade';
import { InfiniCardService } from '../wallet/services/infini-card.service';
import { CardCreationStore } from '../wallet/stores/card-creation.store';
import { InfiniCardResponse } from '../wallet/types/infini-card.type';
import { CardStatus, DashboardResponse } from '../wallet/types/wallet.type';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';
import { InquiryUiStore } from './stores/inquiry-ui.store';
import { InquiryStore } from './stores/inquiry.store';
import { TopUpModalComponent } from './components/top-up/topup-modal.component';
import { WidthdrawlCardModalComponent } from './components/widthdrawl/widthdrawl-modal.component';
import { CardSensitiveDetailModalComponent } from './components/card-sensitive-detail-modal/card-sensitive-detail-modal.component';
import { CardSensitiveDetailResponse } from './types/type';

@Component({
  selector: 'app-inquiry-card-component',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    TopUpModalComponent,
    WidthdrawlCardModalComponent,
    ConfirmModalComponent,
    CardSensitiveDetailModalComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './inquiry-card.component.html',
})
export class InquiryCardComponent {
  private walletFacade = inject(WalletFacade);
  private infiniCards = inject(InfiniCardService);
  private inquiryStore = inject(InquiryStore);
  private toast = inject(ToastrService);
  private destroyRef = inject(DestroyRef);

  protected inquiryUiStore = inject(InquiryUiStore);
  protected creation = inject(CardCreationStore);

  readonly CardStatus = CardStatus;
  private destroyed = false;

  cards = signal<InfiniCardResponse[]>([]);
  cardPage = signal(1);
  cardPageSize = signal(10);
  totalCards = signal(0);
  loadingCards = signal(false);
  isLoading = signal(false);

  dashboard = signal<DashboardResponse | null>(null);
  cardBalance = signal(0);

  openDropdownIndex = signal<number | null>(null);
  dropdownPosition = signal({ top: 0, left: 0 });
  menuCard = computed(() => {
    const index = this.openDropdownIndex();
    return index === null ? null : (this.cards()[index] ?? null);
  });

  detailCard = signal<InfiniCardResponse | null>(null);
  sensitiveDetail = signal<CardSensitiveDetailResponse | null>(null);
  loadingSensitiveDetail = signal(false);

  constructor() {
    this.creation.resume();
    // Reloads after a card was created or funded.
    effect(() => {
      this.creation.completed();
      this.inquiryStore.fundingChanged();
      untracked(() => this.reload());
    });
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.inquiryStore.selectedCard.set(null);
      this.inquiryUiStore.isTopUpModalOpen.set(false);
      this.inquiryUiStore.isWidthdrawlOpen.set(false);
      this.inquiryUiStore.isConfirmFreezeOpen.set(false);
    });
  }

  @HostListener('document:click')
  onClickOutside() {
    this.openDropdownIndex.set(null);
  }

  reload() {
    this.loadCards();
    this.loadSummary();
  }

  /** Only the card owner's own lock can be released here. */
  canUnlock(card: InfiniCardResponse): boolean {
    return card.status === CardStatus.BLOCKED && (!card.locked_by || card.locked_by === 'USER');
  }

  toggleDropdown(i: number, event: MouseEvent) {
    event.stopPropagation();

    if (this.openDropdownIndex() === i) {
      this.openDropdownIndex.set(null);
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const width = 192;
    const height = 280;
    const padding = 12;
    const below = rect.bottom + 8;
    const top = below + height > window.innerHeight - padding ? rect.top - height - 8 : below;

    this.dropdownPosition.set({
      top: Math.max(padding, top),
      left: Math.max(padding, Math.min(rect.right - width, window.innerWidth - width - padding)),
    });
    this.openDropdownIndex.set(i);
  }

  openDetail(card: InfiniCardResponse) {
    this.openDropdownIndex.set(null);

    // Number and CVV are only available for active cards.
    if (card.status !== CardStatus.ACTIVE) {
      this.sensitiveDetail.set(null);
      this.detailCard.set(card);
      return;
    }

    this.loadingSensitiveDetail.set(true);
    this.infiniCards
      .getSensitiveDetail(card.id)
      .pipe(
        finalize(() => this.loadingSensitiveDetail.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.sensitiveDetail.set(res.data);
          this.detailCard.set(card);
        },
        error: (err) => {
          // Still show the basic information.
          this.toast.error(err?.error?.message || 'Failed to load card number');
          this.sensitiveDetail.set(null);
          this.detailCard.set(card);
        },
      });
  }

  closeDetail() {
    this.sensitiveDetail.set(null);
    this.detailCard.set(null);
  }

  openTopUp(card: InfiniCardResponse) {
    this.openDropdownIndex.set(null);
    this.inquiryStore.selectedCard.set(card);
    this.inquiryUiStore.isTopUpModalOpen.set(true);
  }

  openWithdraw(card: InfiniCardResponse) {
    this.openDropdownIndex.set(null);
    this.inquiryStore.selectedCard.set(card);
    this.inquiryUiStore.isWidthdrawlOpen.set(true);
  }

  openFreeze(card: InfiniCardResponse) {
    this.openDropdownIndex.set(null);
    this.inquiryStore.selectedCard.set(card);
    this.inquiryUiStore.isConfirmFreezeOpen.set(true);
  }

  handleFreezeCard() {
    const card = this.inquiryStore.selectedCard();
    if (!card || this.isLoading()) return;

    const freeze = card.status === CardStatus.ACTIVE;
    this.isLoading.set(true);

    (freeze ? this.infiniCards.lockCard(card.id) : this.infiniCards.unlockCard(card.id))
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.inquiryStore.selectedCard.set(null);
          if (!this.destroyed) this.reload();
        }),
      )
      .subscribe({
        next: () =>
          this.toast.success(freeze ? 'Successfully froze card' : 'Successfully unfroze card'),
        error: (err) =>
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message ?? 'Unable to reach the server. Please try again.',
            confirmButtonText: 'OK',
          }),
      });
  }

  onCardPageChange(page: number) {
    this.cardPage.set(page);
    this.loadCards();
  }

  private loadCards() {
    this.loadingCards.set(true);
    this.openDropdownIndex.set(null);
    this.infiniCards
      .getCards(this.cardPage() - 1)
      .pipe(
        finalize(() => this.loadingCards.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.cards.set(res.data.items);
          this.totalCards.set(res.data.total_size);
          this.cardPageSize.set(res.data.size);
        },
        error: (err) => this.toast.error(err?.error?.message ?? 'Unable to load cards'),
      });
  }

  private loadSummary() {
    this.walletFacade
      .getBalance()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.cardBalance.set(Number(res.data.card_balance)),
        error: () => undefined,
      });
    this.walletFacade
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.dashboard.set(res.data),
        error: () => undefined,
      });
  }
}
