import { HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  EMPTY,
  exhaustMap,
  Observable,
  takeUntil,
  takeWhile,
  throwError,
  timer,
} from 'rxjs';

/** The result is unknown (network failure, rate limit, server error): retrying a read is safe. */
export const isTransientError = (err: unknown): boolean =>
  err instanceof HttpErrorResponse && (err.status === 0 || err.status === 429 || err.status >= 500);

/**
 * Repeats a read until `done` is true (that value is emitted last) or `maxMs` has passed.
 * Transient errors are skipped; other errors are rethrown.
 */
export function pollUntil<T>(
  load: () => Observable<T>,
  done: (value: T) => boolean,
  intervalMs: number,
  maxMs: number,
): Observable<T> {
  return timer(0, intervalMs).pipe(
    exhaustMap(() =>
      load().pipe(catchError((err) => (isTransientError(err) ? EMPTY : throwError(() => err)))),
    ),
    takeWhile((value) => !done(value), true),
    takeUntil(timer(maxMs)),
  );
}
