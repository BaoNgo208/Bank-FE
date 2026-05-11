import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/http/base-api.service';
import { UserAssetAllocationResponse } from '../types/dashboard.type';
import { ApiResponse } from '../../../core/auth/auth.request';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseApiService {
  protected override resource = 'dashboard';

  getAssetAllocation(): Observable<ApiResponse<UserAssetAllocationResponse>> {
    return this.get('/asset-allocation');
  }
}
