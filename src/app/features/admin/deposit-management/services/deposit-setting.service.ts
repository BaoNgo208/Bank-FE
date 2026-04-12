import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/auth/auth.request';
import {
  CreateDepositSettingsRequest,
  DepositSettingsResponse,
} from '../type/deposit-management.type';

@Injectable({
  providedIn: 'root',
})
export class DepositSettingService extends BaseApiService {
  protected override resource = 'admin/deposit-settings';

  createDepositSettings(
    request: CreateDepositSettingsRequest,
  ): Observable<ApiResponse<DepositSettingsResponse>> {
    return this.post('/created', request);
  }
}
