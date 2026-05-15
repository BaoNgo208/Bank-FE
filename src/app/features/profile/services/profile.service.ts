import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ChangePasswordRequest, UserProfileResponse } from '../types/profile.type';
import { ApiResponse } from '../../../core/auth/auth.request';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseApiService {
  protected override resource = 'user/profile';

  getUserProfile(): Observable<ApiResponse<UserProfileResponse>> {
    return this.get('');
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.put('/password', request);
  }
}
