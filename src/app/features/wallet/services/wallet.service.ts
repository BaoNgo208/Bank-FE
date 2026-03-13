import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import {
  CreateDepositOrderRequest,
  CreateDepositOrderResponse,
  DepositConfigResponse,
  DepositPreviewRequest,
  DepositPreviewResponse,
  Stablecoin,
} from '../types/wallet.type';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';

@Injectable({
  providedIn: 'root',
})
export class WalletService extends BaseApiService {
  protected override resource = 'deposit';

  getDepositConfig(currency: Stablecoin): Observable<ApiResponse<DepositConfigResponse>> {
    const params = this.buildPageParams(undefined, undefined, {
      currency: currency,
    });
    return this.get<ApiResponse<DepositConfigResponse>>('/config', params);
  }

  previewDeposit(request: DepositPreviewRequest): Observable<ApiResponse<DepositPreviewResponse>> {
    return this.post<ApiResponse<DepositPreviewResponse>>('/preview', request);
  }

  createDepositOrder(
    request: CreateDepositOrderRequest,
  ): Observable<ApiResponse<CreateDepositOrderResponse>> {
    return this.post<ApiResponse<CreateDepositOrderResponse>>('/orders', request);
  }
}
