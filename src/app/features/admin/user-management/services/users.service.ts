import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/auth/auth.request';
import {
  AdminUserPageResponse,
  AdminUserResponse,
  UpdateCardOpenLimitRequest,
} from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseApiService {
  protected override resource = 'admin/users';

  getUsers(page: number = 0): Observable<ApiResponse<AdminUserPageResponse>> {
    const params = this.buildPageParams(page, undefined, undefined);
    return this.get('', params);
  }

  updateCardOpenLimit(
    userId: number,
    request: UpdateCardOpenLimitRequest,
  ): Observable<ApiResponse<AdminUserResponse>> {
    return this.patch(`/${userId}/card-open-limit`, request);
  }
}
