import { Observable } from 'rxjs';
import { BaseApiService } from '../../../../core/http/base-api.service';
import { ApiResponse } from '../../../../core/auth/auth.request';
import { AnnouncementPageResponse } from '../types/notification.type';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublicNotificationService extends BaseApiService {
  protected override resource = 'announcements';

  getAnnouncements(page: number = 0): Observable<ApiResponse<AnnouncementPageResponse>> {
    const params = this.buildPageParams(page, undefined, undefined);
    return this.get('/list', params);
  }
}
