import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth.store';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export const SKIP_AUTH_URLS = [
  '/auth/signin',
  '/auth/signup',
  '/otp/request',
  '/auth/refresh-token',
];

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

function resolveLoginUrl(router: Router): string {
  const currentUrl = router.url;

  return currentUrl.startsWith('/admin') ? '/admin/auth/login' : '/auth/login';
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const token = authStore.accessToken();
  const router = inject(Router);

  if (SKIP_AUTH_URLS.some((path) => req.url.includes(path))) {
    return next(req);
  }

  // if has token, clone request and attach header Authorization

  if (token) {
    const clonedReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    return next(clonedReq).pipe(
      catchError((err) => {
        if (err.status !== 401) {
          const is401 = err.status === 401 || err.error?.status === 401;

          if (!is401) {
            return throwError(() => err);
          }
        }

        // 401 => handle refresh
        if (!isRefreshing) {
          isRefreshing = true;

          return authService.refreshToken(authStore.refreshToken()).pipe(
            switchMap((res) => {
              isRefreshing = false;
              authStore.setTokens(res.tokens.access_token, res.tokens.refresh_token);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.tokens.access_token}`,
                },
              });

              refreshQueue.forEach((cb) => cb(res.tokens.access_token));
              refreshQueue = [];
              return next(retryReq);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              refreshQueue = [];

              authStore.clearAuth();
              router.navigate([resolveLoginUrl(router)]);
              return throwError(() => refreshErr);
            }),
          );
        }

        // if refreshing => push others requests to queues
        return new Observable<HttpEvent<unknown>>((observer) => {
          refreshQueue.push((newToken: string) => {
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });

            next(retryReq).subscribe({
              next: (event) => observer.next(event),
              error: (err) => observer.error(err),
              complete: () => observer.complete(),
            });
          });
        });
      }),
      // finalize(() => {
      //   isRefreshing = false;
      // }),
    );
  } else {
    console.warn('[AuthInterceptor] No token found in localStorage!');
  }

  // if doesnt have token, send request normally
  return next(req);
};
