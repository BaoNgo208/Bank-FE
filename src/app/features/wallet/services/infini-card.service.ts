import { inject, Injectable } from '@angular/core';
import { catchError, last, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';
import { BaseApiService } from '../../../core/http/base-api.service';
import { isTransientError, pollUntil } from '../../../utils/poll.util';
import { CardSensitiveDetailResponse } from '../../inquiry-card/types/type';
import {
  InfiniCardPageResponse,
  InfiniFundingAction,
  InfiniFundingRequest,
  InfiniFundingResponse,
  isFinalStatus,
} from '../types/infini-card.type';

@Injectable({ providedIn: 'root' })
export class InfiniCardService extends BaseApiService {
  protected override resource = 'infini-cards';

  getCards(page = 0): Observable<ApiResponse<InfiniCardPageResponse>> {
    return this.get('', this.buildPageParams(page));
  }

  getSensitiveDetail(cardId: number): Observable<ApiResponse<CardSensitiveDetailResponse>> {
    return this.get(`/${cardId}/sensitive-details`);
  }

  lockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/lock`);
  }

  unlockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/unlock`);
  }

  submitFunding(
    action: InfiniFundingAction,
    cardId: number,
    request: InfiniFundingRequest,
  ): Observable<ApiResponse<InfiniFundingResponse>> {
    return this.post(`/${cardId}/${action}`, request);
  }

  getFundingStatus(requestId: string): Observable<ApiResponse<InfiniFundingResponse>> {
    return this.get(`/funding/${requestId}`);
  }
}

/** Top-up and withdraw with a request ID that is reused until the result is known. */
@Injectable({ providedIn: 'root' })
export class InfiniFundingFlow {
  private cards = inject(InfiniCardService);
  private drafts = new Map<string, InfiniFundingRequest>();

  /** Emits once: a final result, or the latest PENDING / REVIEW_REQUIRED state after about 30 seconds. */
  run(
    action: InfiniFundingAction,
    cardId: number,
    amount: number,
  ): Observable<InfiniFundingResponse> {
    const key = `${action}:${cardId}`;
    let draft = this.drafts.get(key);
    if (!draft || draft.amount !== amount) {
      draft = { requestId: crypto.randomUUID(), amount };
      this.drafts.set(key, draft);
    }
    const request = draft;

    return this.cards.submitFunding(action, cardId, request).pipe(
      map((res) => res.data),
      catchError((err) =>
        isTransientError(err)
          ? // The backend may have accepted it: ask for this request instead of sending another one.
            this.cards.getFundingStatus(request.requestId).pipe(
              map((res) => res.data),
              catchError(() => throwError(() => err)),
            )
          : throwError(() => err),
      ),
      switchMap((order) =>
        isFinalStatus(order.status)
          ? of(order)
          : pollUntil(
              () => this.cards.getFundingStatus(request.requestId).pipe(map((res) => res.data)),
              (value) => isFinalStatus(value.status),
              3000,
              30000,
            ).pipe(last(undefined, order)),
      ),
      tap({
        next: (order) => {
          if (isFinalStatus(order.status)) this.drafts.delete(key);
        },
        error: (err) => {
          // Rejected for certain: the next attempt is a new request.
          if (!isTransientError(err)) this.drafts.delete(key);
        },
      }),
    );
  }
}
