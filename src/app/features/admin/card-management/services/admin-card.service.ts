import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { AdminCardPageResponse } from '../types/admin-card.type';
import { ApiResponse } from '../../../../core/auth/auth.request';
import { CardStatus } from '../../../wallet/types/wallet.type';

@Injectable({
  providedIn: 'root',
})
export class AdminCardService extends BaseApiService {
  protected override resource = 'admin/cards';

  getAdminCards(
    page: number = 0,
    params?: {
      cardNumber?: string;
      cardName?: string;
      username?: string;
      status?: CardStatus;
      fromTime?: string;
      toTime?: string;
    },
  ): Observable<ApiResponse<AdminCardPageResponse>> {
    const httpParams = this.buildPageParams(page, undefined, {
      cardNumber: params?.cardNumber,
      cardName: params?.cardName,
      username: params?.username,
      status: params?.status,
      fromTime: params?.fromTime,
      toTime: params?.toTime,
    });

    return this.get('/list', httpParams);
  }

  lockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/lock`);
  }

  unlockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/unlock`);
  }
}
