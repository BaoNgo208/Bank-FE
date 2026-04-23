import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';
import { CashbackDashboardResponse } from '../../inquiry-card/types/type';

@Injectable({
  providedIn: 'root',
})
export class CashbackService extends BaseApiService {
  protected override resource = 'cashback';

  getDashboard(): Observable<ApiResponse<CashbackDashboardResponse>> {
    return this.get('/dashboard');
  }
}
