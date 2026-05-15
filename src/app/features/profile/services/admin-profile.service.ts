import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { AdminProfileResponse, ChangePasswordRequest } from '../types/profile.type';
import { ApiResponse } from '../../../core/auth/auth.request';

@Injectable({
  providedIn: 'root',
})
export class AdminProfileService extends BaseApiService {
  protected override resource = 'admin/profile';

  getAdminProfile(): Observable<ApiResponse<AdminProfileResponse>> {
    return this.get('');
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.put('/password', request);
  }
}
