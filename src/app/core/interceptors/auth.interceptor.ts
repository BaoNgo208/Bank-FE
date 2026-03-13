import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const SKIP_AUTH_URLS = ['/auth/signin', '/auth/signup', '/otp/request'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');

  // skip auth endpoints
  if (SKIP_AUTH_URLS.some((path) => req.url.includes(path))) {
    return next(req);
  }

  // attach token if exists
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        console.warn('[AuthInterceptor] Token expired or invalid');
      }
      return throwError(() => err);
    }),
  );
};
