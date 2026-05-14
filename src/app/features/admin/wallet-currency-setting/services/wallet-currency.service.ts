import { Observable } from 'rxjs';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { ApiResponse } from '../../../../core/auth/auth.request';
import {
  UpdateWalletCurrencySettingsRequest,
  WalletCurrencySettingsResponse,
} from '../types/wallet-currency.type';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WalletCurrencySettingService extends BaseApiService {
  protected override resource = 'admin/wallet-currency-settings';

  getAllSettings(): Observable<ApiResponse<WalletCurrencySettingsResponse[]>> {
    return this.get('');
  }

  updateSettings(
    id: number,
    request: UpdateWalletCurrencySettingsRequest,
  ): Observable<ApiResponse<WalletCurrencySettingsResponse>> {
    return this.put(`/${id}`, request);
  }
}
