import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import {
  AdminCashFlowResponse,
  AdminDashboardSummaryResponse,
  DashboardPeriod,
} from '../types/admin-dashboard.type';
import { ApiResponse } from '../../../../core/auth/auth.request';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService extends BaseApiService {
  protected override resource = 'admin/dashboard';

  getSummary(): Observable<ApiResponse<AdminDashboardSummaryResponse>> {
    return this.get('/summary');
  }

  getCashFlow(
    period: DashboardPeriod = DashboardPeriod.WEEK,
  ): Observable<ApiResponse<AdminCashFlowResponse>> {
    const params = new HttpParams().set('period', period);

    return this.get<ApiResponse<AdminCashFlowResponse>>('/cash-flow', params);
  }
}
