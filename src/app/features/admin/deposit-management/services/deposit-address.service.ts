import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/auth/auth.request';
import {
  CreateDepositAddressRequest,
  DepositAddressResponse,
} from '../type/deposit-management.type';

@Injectable({
  providedIn: 'root',
})
export class DepositAddressService extends BaseApiService {
  protected override resource = 'admin/deposit-addresses';

  createDepositAddress(
    request: CreateDepositAddressRequest,
  ): Observable<ApiResponse<DepositAddressResponse>> {
    return this.post('/created', request);
  }
}
