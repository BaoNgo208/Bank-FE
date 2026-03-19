import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import {
  CreateDepositOrderRequest,
  CreateDepositOrderResponse,
  DepositConfigResponse,
  DepositOrderPageResponse,
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

  getDepositOrders(page: number): Observable<ApiResponse<DepositOrderPageResponse>> {
    const params = this.buildPageParams(page, undefined, undefined);

    return this.get<ApiResponse<DepositOrderPageResponse>>('/orders-list', params);
  }

  uploadDepositImages(orderNo: string, images: File[]): Observable<ApiResponse<null>> {
    const formData = new FormData();

    images.forEach((file) => {
      formData.append('images', file);
    });

    return this.post<ApiResponse<null>>(`/orders/${orderNo}/images`, formData);
  }
}
