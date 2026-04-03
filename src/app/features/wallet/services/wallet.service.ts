import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import {
  CardPageResponse,
  CardStatus,
  CreateCardRequest,
  TopupCardRequest,
  WithDrawCardRequest,
} from '../types/wallet.type';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';

@Injectable({
  providedIn: 'root',
})
export class WalletService extends BaseApiService {
  protected override resource = 'wallet';

  createCard(request: CreateCardRequest): Observable<ApiResponse<void>> {
    return this.post('/create-card', request);
  }

  topupCard(cardId: number, request: TopupCardRequest): Observable<ApiResponse<void>> {
    return this.post(`/cards/${cardId}/topup`, request);
  }

  getCards(page: number = 0): Observable<ApiResponse<CardPageResponse>> {
    const params = this.buildPageParams(page);
    return this.get('/cards', params);
  }

  withDrawCard(cardId: number, request: WithDrawCardRequest): Observable<ApiResponse<void>> {
    return this.post(`/cards/${cardId}/withdraw`, request);
  }
}
