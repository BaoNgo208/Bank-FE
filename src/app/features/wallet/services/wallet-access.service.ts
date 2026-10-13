import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, of, shareReplay, tap } from 'rxjs';
import { ApiResponse } from '../../../core/auth/auth.request';
import { CreateWalletExternalAddressRequest } from '../types/wallet.type';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletAccessService {
  private readonly walletService = inject(WalletService);
  private readonly _configured = signal<boolean | null>(null);
  private pendingCheck$: Observable<boolean> | null = null;

  readonly configured = this._configured.asReadonly();

  checkConfigured(force = false): Observable<boolean> {
    const currentValue = this._configured();

    if (!force && currentValue !== null) {
      return of(currentValue);
    }

    if (this.pendingCheck$) {
      return this.pendingCheck$;
    }

    this.pendingCheck$ = this.walletService.isExternalAddressConfigured().pipe(
      map((response) => response.data === true),
      tap((configured) => this._configured.set(configured)),
      finalize(() => (this.pendingCheck$ = null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.pendingCheck$;
  }

  createExternalAddress(
    request: CreateWalletExternalAddressRequest,
  ): Observable<ApiResponse<void>> {
    return this.walletService
      .createExternalAddress(request)
      .pipe(tap(() => this._configured.set(true)));
  }

  reset(): void {
    this._configured.set(null);
  }
}
