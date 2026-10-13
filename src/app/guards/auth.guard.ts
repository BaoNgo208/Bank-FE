import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { WalletAccessService } from '../features/wallet/services/wallet-access.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const walletAccessService = inject(WalletAccessService);

  const token = localStorage.getItem('accessToken');
  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  // This runs after login and on the first protected route after a page reload.
  return walletAccessService.checkConfigured(true).pipe(
    map(() => true),
    // Do not lock the user out of the whole app if this request temporarily fails.
    // The wallet guard retries before allowing access to deposit/withdraw features.
    catchError(() => of(true)),
  );
};
