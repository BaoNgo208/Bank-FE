import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/auth/auth.request';
import {
  DepositOrderPageAdminResponse,
  DepositOrderStatus,
  UpdateDepositStatusRequest,
} from '../types/deposit.type';

@Injectable({
  providedIn: 'root',
})
export class DepositService extends BaseApiService {
  protected override resource = 'admin/deposits';

  getAllDepositOrders(
    page: number = 0,
    params?: {
      orderNo?: string;
      username?: string;
      status?: DepositOrderStatus;
      fromTime?: string;
      toTime?: string;
    },
  ): Observable<ApiResponse<DepositOrderPageAdminResponse>> {
    const httpParams = this.buildPageParams(page, undefined, {
      order_no: params?.orderNo,
      username: params?.username,
      status: params?.status,
      from_time: params?.fromTime,
      to_time: params?.toTime,
    });

    return this.get('/orders', httpParams);
  }

  updateDepositStatus(
    orderNo: string,
    request: UpdateDepositStatusRequest,
  ): Observable<ApiResponse<void>> {
    return this.patch(`/${orderNo}/status`, request);
  }
}
