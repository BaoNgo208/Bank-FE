import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import {
  ConfirmWithdrawOtpRequest,
  CreateWithdrawOrderRequest,
  CreateWithdrawOrderResponse,
  WithdrawDashboardResponse,
  WithdrawOrderStatus,
  WithdrawSummaryResponse,
} from '../types/wallet.type';
import { ApiResponse } from '../../../core/auth/auth.request';
import { Observable } from 'rxjs';
import { WithdrawOrderPageResponse } from '../../admin/withdrawals-management/model/widthdrawl.model';

@Injectable({
  providedIn: 'root',
})
export class WidthdrawlService extends BaseApiService {
  protected override resource = 'withdraw';

  createWithdrawOrder(
    request: CreateWithdrawOrderRequest,
  ): Observable<ApiResponse<CreateWithdrawOrderResponse>> {
    return this.post<ApiResponse<CreateWithdrawOrderResponse>>('/orders', request);
  }

  confirmWithdrawOtp(request: ConfirmWithdrawOtpRequest): Observable<ApiResponse<null>> {
    return this.post<ApiResponse<null>>('/confirm-otp', request);
  }

  resendWithdrawOtp(orderNo: string): Observable<ApiResponse<null>> {
    const params = this.buildPageParams(undefined, undefined, {
      orderNo,
    });

    return this.post<ApiResponse<null>>('/resend-otp', params);
  }

  getWithdrawOrders(page: number = 0): Observable<ApiResponse<WithdrawOrderPageResponse>> {
    const params = this.buildPageParams(page);

    return this.get('/orders-list', params);
  }

  searchWidthdrawlOrders(
    page?: number,
    params?: {
      orderNo?: string;
      address?: string;
      status?: WithdrawOrderStatus;
      fromTime?: string;
      toTime?: string;
    },
  ): Observable<ApiResponse<WithdrawOrderPageResponse>> {
    return this.get<ApiResponse<WithdrawOrderPageResponse>>(
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

  getWithdrawDashboard(): Observable<ApiResponse<WithdrawDashboardResponse>> {
    return this.get('/dashboard');
  }

  getWithdrawSummary(): Observable<ApiResponse<WithdrawSummaryResponse>> {
    return this.get('/summary');
  }
}
