import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';
import { CardTransactionPageResponse, CardTransactionStatus } from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class CardTransactionService extends BaseApiService {
  protected override resource = 'card-transactions';

  getCardTransactions(
    page: number = 0,
    params?: {
      slashTransactionId?: string;
      merchantDescription?: string;
      status?: CardTransactionStatus;
      fromTime?: string;
      toTime?: string;
    },
  ): Observable<ApiResponse<CardTransactionPageResponse>> {
    const httpParams = this.buildPageParams(page, undefined, {
      slash_transaction_id: params?.slashTransactionId,
      merchant_description: params?.merchantDescription,
      status: params?.status,
      from_time: params?.fromTime,
      to_time: params?.toTime,
    });

    return this.get<ApiResponse<CardTransactionPageResponse>>('/orders', httpParams);
  }
}
