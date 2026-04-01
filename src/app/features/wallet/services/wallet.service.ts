import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { CreateCardRequest, TopupCardRequest } from '../types/wallet.type';
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
}
