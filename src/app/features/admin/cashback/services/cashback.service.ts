import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/http/base-api.service';
import {
  CashbackRuleResponse,
  CreateCashbackRuleRequest,
  UpdateCashbackRuleRequest,
} from '../types/type';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/auth/auth.request';

@Injectable({
  providedIn: 'root',
})
export class CashbackService extends BaseApiService {
  protected override resource = 'admin/cashback-rules';

  createCashbackRule(
    request: CreateCashbackRuleRequest,
  ): Observable<ApiResponse<CashbackRuleResponse>> {
    return this.post('/create', request);
  }

  updateCashbackRule(
    id: number,
    request: UpdateCashbackRuleRequest,
  ): Observable<ApiResponse<CashbackRuleResponse>> {
    return this.patch(`/update/${id}`, request);
  }

  deleteCashbackRule(id: number): Observable<ApiResponse<void>> {
    return this.delete(`/delete/${id}`);
  }

  getCashbackRules(): Observable<ApiResponse<CashbackRuleResponse[]>> {
    return this.get('/list');
  }
}
