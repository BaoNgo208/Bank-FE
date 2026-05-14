import { Observable } from 'rxjs';
import { BaseApiService } from '../http/base-api.service';
import { ApiResponse, ForgotPasswordOtpRequest, OtpRequest } from './auth.request';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OtpService extends BaseApiService {
  protected override resource = 'otp';

  requestOtp(request: OtpRequest): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/request', request);
  }

  requestResetOtp(request: ForgotPasswordOtpRequest): Observable<ApiResponse<any>> {
    return this.post('/request-otp', request);
  }
}
