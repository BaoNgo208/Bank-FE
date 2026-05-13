import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../http/base-api.service';
import { Observable } from 'rxjs';
import {
  AdminLoginOtpRequest,
  AdminSigninRequest,
  ApiResponse,
  SignupRequest,
} from './auth.request';
import { SigninResponse } from './auth.request';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService extends BaseApiService {
  protected override resource = 'admin/auth';

  signIn(data: AdminSigninRequest) {
    return this.post<SigninResponse>(`/signin`, data);
  }

  requestLoginOtp(data: AdminLoginOtpRequest): Observable<ApiResponse<null>> {
    return this.post(`/request-login-otp`, data);
  }
}
