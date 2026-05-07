import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import {
  CardTransactionPageResponse,
  CardTransactionStatus,
} from '../../../card_transactions/types/type';
import { ApiResponse } from '../../../../core/auth/auth.request';

@Injectable({
  providedIn: 'root',
})
export class CardTransactionsService extends BaseApiService {
  protected override resource = 'admin/card-transactions';

  getUserCardTransactions(
    userId: number,
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

    return this.get(`/users/${userId}/orders`, httpParams);
  }
}
