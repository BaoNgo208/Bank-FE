import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';
import { CardDashboardResponse, CardSearchParams } from '../types/card.type';
import { CardPageResponse, CardStatus } from '../types/wallet.type';
import { CardSensitiveDetailResponse } from '../../inquiry-card/types/type';

@Injectable({ providedIn: 'root' })
export class CardService extends BaseApiService {
  protected override resource = 'card';

  lockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/lock`);
  }

  unlockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/unlock`);
  }

  getCardDashboard(): Observable<ApiResponse<CardDashboardResponse>> {
    return this.get('/dashboard');
  }

  searchCards(
    page?: number,
    params?: {
      cardNumber?: string;
      cardName?: string;
      status?: CardStatus;
      fromTime?: string;
      toTime?: string;
    },
  ): Observable<ApiResponse<CardPageResponse>> {
    return this.get<ApiResponse<CardPageResponse>>(
      '/search',
      this.buildPageParams(page, undefined, {
        cardNumber: params?.cardNumber,
        cardName: params?.cardName,
        status: params?.status,
        fromTime: params?.fromTime,
        toTime: params?.toTime,
      }),
    );
  }

  getSensitiveDetail(cardId: number): Observable<ApiResponse<CardSensitiveDetailResponse>> {
    return this.get(`/${cardId}/sensitive-details`);
  }
}
