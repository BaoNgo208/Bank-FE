import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService {
  protected readonly baseUrl = environment.apiUrl;
  protected abstract resource: string;
  protected http = inject(HttpClient);

  protected buildPageParams(
    page?: number,
    size?: number,
    extra?: Record<string, string | number | boolean | undefined>,
  ): HttpParams {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.set('page', page);
    }

    if (size !== undefined) {
      params = params.set('size', size);
    }

    if (extra) {
      Object.entries(extra).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value);
        }
      });
    }

    return params;
  }

  protected get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.resource}${url}`, {
      params,
      headers,
    });
  }

  protected post<T>(
    url: string,
    body?: unknown,
    options?: {
      headers?: HttpHeaders | { [header: string]: string };
    },
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${this.resource}${url}`, body ?? null, options);
  }

  protected put<T>(url: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${this.resource}${url}`, body, {
      headers,
    });
  }
  protected patch<T>(
    url: string,
    body?: unknown,
    options?: {
      headers?: HttpHeaders | { [header: string]: string };
    },
  ): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${this.resource}${url}`, body ?? null, options);
  }

  protected delete<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${this.resource}${url}`, {
      params,
      headers,
    });
  }
}
