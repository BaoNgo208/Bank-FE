import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse, SigninRequest, SignupRequest } from './auth.request';
import { SigninResponse } from './auth.request';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService extends BaseApiService {
  protected override resource = 'admin/auth';

  signIn(data: SigninRequest) {
    return this.post<SigninResponse>(`/signin`, data);
  }
}
