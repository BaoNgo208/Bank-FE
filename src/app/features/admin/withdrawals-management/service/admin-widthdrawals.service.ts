import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/auth/auth.request';
import { UpdateWithdrawStatusRequest, WithdrawOrderPageResponse } from '../model/widthdrawl.model';

@Injectable({
  providedIn: 'root',
})
export class AdminWithdrawalsService extends BaseApiService {
  protected override resource = 'admin/withdraw';

  getAllWithdrawOrders(page: number = 0): Observable<ApiResponse<WithdrawOrderPageResponse>> {
    const params = this.buildPageParams(page);

    return this.get('/orders', params);
  }

  updateWithdrawStatus(
    order_no: string,
    request: UpdateWithdrawStatusRequest,
  ): Observable<ApiResponse<void>> {
    return this.patch(`/${order_no}/status`, request);
  }
}
