import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Subscription } from 'rxjs';
import { isTransientError, pollUntil } from '../../../utils/poll.util';
import { WalletService } from '../services/wallet.service';
import {
  CardCreationResponse,
  CreateInfiniCardInput,
  isFinalStatus,
} from '../types/infini-card.type';

const STORAGE_KEY = 'infini-card-creation';
const POLL_INTERVAL_MS = 2500;
const POLL_MAX_MS = 5 * 60 * 1000;

/** Creates a card and follows it until it is final, even when the user leaves the page or reloads. */
@Injectable({ providedIn: 'root' })
export class CardCreationStore {
  private walletService = inject(WalletService);
  private toast = inject(ToastrService);

  order = signal<CardCreationResponse | null>(null);
  submitting = signal(false);
  polling = signal(false);
  error = signal<string | null>(null);
  /** Increases whenever a creation succeeds, so that pages can reload. */
  completed = signal(0);

  // Same form content => same request ID, so a retry never creates a second card.
  private draft: { content: string; requestId: string } | null = null;
  private pollSub?: Subscription;

  /** Resumes a creation that was still running before a reload. */
  resume() {
    const requestId = this.storedId();
    if (requestId && !this.submitting() && !this.polling()) this.follow(requestId);
  }

  submit(input: CreateInfiniCardInput) {
    if (this.submitting() || this.polling()) return;

    const content = JSON.stringify(input);
    if (this.draft?.content !== content) {
      this.draft = { content, requestId: crypto.randomUUID() };
    }
    const requestId = this.draft.requestId;

    this.error.set(null);
    this.order.set(null);
    this.submitting.set(true);
    this.storeId(requestId);

    this.walletService.createCard({ requestId, ...input }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.accept(res.data);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        const pendingId: string | undefined = err.error?.data?.request_id;

        this.error.set(err.error?.message ?? 'Unable to reach the server. Please try again.');
        if (err.status === 409 && pendingId) {
          // Another creation is still running: follow that one.
          this.draft = null;
          this.storeId(pendingId);
          this.follow(pendingId);
        } else if (isTransientError(err)) {
          this.follow(requestId);
        } else {
          this.draft = null;
          this.storeId(null);
        }
      },
    });
  }

  checkAgain() {
    const requestId = this.order()?.request_id ?? this.storedId();
    if (requestId && !this.polling()) this.follow(requestId);
  }

  dismiss() {
    this.order.set(null);
    this.error.set(null);
  }

  private accept(order: CardCreationResponse) {
    this.setOrder(order);
    if (!isFinalStatus(order.status)) this.follow(order.request_id);
  }

  private setOrder(order: CardCreationResponse) {
    this.order.set(order);
    this.error.set(null);
    if (!isFinalStatus(order.status)) return;

    this.draft = null;
    this.storeId(null);
    if (order.status === 'SUCCEEDED') {
      this.completed.update((n) => n + 1);
      this.toast.success('Your card is ready.');
    } else {
      this.toast.error(
        'The card could not be created. The held amount was returned to your wallet.',
      );
    }
  }

  private follow(requestId: string) {
    this.pollSub?.unsubscribe();
    this.polling.set(true);

    this.pollSub = pollUntil(
      () => this.walletService.getCardCreation(requestId).pipe(map((res) => res.data)),
      (order) => isFinalStatus(order.status),
      POLL_INTERVAL_MS,
      POLL_MAX_MS,
    ).subscribe({
      next: (order) => this.setOrder(order),
      error: (err: HttpErrorResponse) => {
        this.polling.set(false);
        // 404: the backend never stored it (or it belongs to another account).
        if (err.status === 404) this.storeId(null);
      },
      complete: () => this.polling.set(false),
    });
  }

  private storedId(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private storeId(requestId: string | null) {
    try {
      if (requestId) sessionStorage.setItem(STORAGE_KEY, requestId);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is unavailable: only resuming after a reload is lost.
    }
  }
}
