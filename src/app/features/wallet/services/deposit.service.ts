import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import {
  CreateCardRequest,
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
import { DepositOrderStatus } from '../../admin/deposit-orders-management/types/deposit.type';

@Injectable({
  providedIn: 'root',
})
export class DepositService extends BaseApiService {
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

  searchDepositOrders(
    page?: number,
    params?: {
      orderNo?: string;
      address?: string;
      status?: DepositOrderStatus;
      fromTime?: string;
      toTime?: string;
    },
  ): Observable<ApiResponse<DepositOrderPageResponse>> {
    return this.get<ApiResponse<DepositOrderPageResponse>>(
      '/orders',
      this.buildPageParams(page, undefined, {
        orderNo: params?.orderNo,
        address: params?.address,
        status: params?.status,
        fromTime: params?.fromTime,
        toTime: params?.toTime,
      }),
    );
  }

  uploadDepositImages(orderNo: string, images: File[]): Observable<ApiResponse<null>> {
    const formData = new FormData();

    images.forEach((file) => {
      formData.append('images', file);
    });

    return this.post<ApiResponse<null>>(`/orders/${orderNo}/images`, formData);
  }
}
