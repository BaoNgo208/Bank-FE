import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse, SigninRequest, SignupRequest } from './auth.request';
import { SigninResponse } from './auth.request';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  protected override resource = 'auth';

  signIn(data: SigninRequest) {
    return this.post<SigninResponse>(`/signin`, data);
  }

  signup(data: SignupRequest): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/signup', data);
  }

  refreshToken(refreshToken: string | '') {
    return this.post<SigninResponse>(`/refresh-token`, null, {
      headers: {
        'X-Refresh-Token': refreshToken,
      },
    });
  }

  loginWithGoogle(idToken: string, deviceId: string): Observable<SigninResponse> {
    const headers = new HttpHeaders({
      'X-Google-ID-Token': idToken,
      'X-Device-Id': deviceId,
    });
    return this.post<SigninResponse>(`/signin/google`, {}, { headers });
  }

  saveTokens(tokens: { access_token: string; refresh_token: string }) {
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
  }
}
