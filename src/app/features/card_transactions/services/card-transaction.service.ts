import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';
import { CardTransactionPageResponse, CardTransactionStatus } from '../types/type';
import {
  CardFundingTransactionPageResponse,
  CardTxnStatus,
  CardTxnType,
} from '../../card-funding/types/card-funding.type';

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

  getFundingTransactions(
    page: number = 0,
    params?: {
      last4?: string;
      type?: CardTxnType;
      status?: CardTxnStatus;
      fromTime?: string;
      toTime?: string;
    },
  ): Observable<ApiResponse<CardFundingTransactionPageResponse>> {
    const httpParams = this.buildPageParams(page, undefined, {
      last4: params?.last4,
      type: params?.type,
      status: params?.status,
      fromTime: params?.fromTime,
      toTime: params?.toTime,
    });

    return this.get('/search', httpParams);
  }
}
