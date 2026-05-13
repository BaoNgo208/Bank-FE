import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/http/base-api.service';
import { UserAssetAllocationResponse, UserCashFlowResponse } from '../types/dashboard.type';
import { ApiResponse } from '../../../core/auth/auth.request';
import { Injectable } from '@angular/core';
import { DashboardPeriod } from '../../admin/dashboard/types/admin-dashboard.type';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseApiService {
  protected override resource = 'dashboard';

  getAssetAllocation(): Observable<ApiResponse<UserAssetAllocationResponse>> {
    return this.get('/asset-allocation');
  }

  getUserCashFlow(
    period: DashboardPeriod = DashboardPeriod.WEEK,
  ): Observable<ApiResponse<UserCashFlowResponse>> {
    const params = new HttpParams().set('period', period);

    return this.get<ApiResponse<UserCashFlowResponse>>('/cash-flow', params);
  }
}
