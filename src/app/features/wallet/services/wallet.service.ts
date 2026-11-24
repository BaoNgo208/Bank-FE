import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/http/base-api.service';
import {
  BalanceResponse,
  CreateWalletExternalAddressRequest,
  DashboardResponse,
} from '../types/wallet.type';
import {
  CardCreationConfigResponse,
  CardCreationResponse,
  CreateInfiniCardRequest,
} from '../types/infini-card.type';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';

@Injectable({
  providedIn: 'root',
})
export class WalletService extends BaseApiService {
  protected override resource = 'wallet';

  isExternalAddressConfigured(): Observable<ApiResponse<boolean>> {
    return this.get<ApiResponse<boolean>>('/external-address/configured');
  }

  createExternalAddress(
    request: CreateWalletExternalAddressRequest,
  ): Observable<ApiResponse<void>> {
    return this.post<ApiResponse<void>>('/external-address', request);
  }

  createCard(request: CreateInfiniCardRequest): Observable<ApiResponse<CardCreationResponse>> {
    return this.post('/create-card', request);
  }

  getCardCreationConfig(): Observable<ApiResponse<CardCreationConfigResponse>> {
    return this.get('/card-creation-config');
  }

  getCardCreation(requestId: string): Observable<ApiResponse<CardCreationResponse>> {
    return this.get(`/card-creation/${requestId}`);
  }

  getBalance(): Observable<ApiResponse<BalanceResponse>> {
    return this.get('/balance');
  }

  getDashboard(): Observable<ApiResponse<DashboardResponse>> {
    return this.get('/dashboard');
  }
}
