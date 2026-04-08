import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';

@Injectable({ providedIn: 'root' })
export class CardService extends BaseApiService {
  protected override resource = 'card';

  lockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/lock`);
  }

  unlockCard(cardId: number): Observable<ApiResponse<void>> {
    return this.post(`/${cardId}/unlock`);
  }
}
