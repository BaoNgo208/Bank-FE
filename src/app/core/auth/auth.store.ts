import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  // ===== state =====
  private readonly _accessToken = signal<string | null>(localStorage.getItem('accessToken'));

  private readonly _refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));
  private readonly _publicId = signal<string | null>(localStorage.getItem('publicId'));

  // ===== selectors =====
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly accessToken = computed(() => this._accessToken());
  readonly refreshToken = computed(() => this._refreshToken() || '');
  readonly publicId = computed(() => this._publicId() || '');

  // ===== actions =====
  setTokens(accessToken: string, refreshToken: string) {
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearAuth() {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
