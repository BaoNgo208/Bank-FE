import { Observable } from 'rxjs';
import { BaseApiService } from '../../../../core/http/base-api.service';
import {
  AnnouncementResponse,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '../types/notification.type';
import { ApiResponse } from '../../../../core/auth/auth.request';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends BaseApiService {
  protected override resource = 'admin/announcements';

  createAnnouncement(
    request: CreateAnnouncementRequest,
  ): Observable<ApiResponse<AnnouncementResponse>> {
    return this.post('/created', request);
  }

  updateAnnouncement(
    notiId: number,
    request: UpdateAnnouncementRequest,
  ): Observable<ApiResponse<AnnouncementResponse>> {
    return this.put(`/${notiId}`, request);
  }

  deleteAnnouncement(notiId: number): Observable<ApiResponse<void>> {
    return this.delete(`/${notiId}`);
  }
}
