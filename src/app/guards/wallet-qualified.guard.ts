import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';
import { WalletService } from '../features/wallet/services/wallet.service';

export const walletQualifiedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const walletService = inject(WalletService);

  return walletService.isWalletQualified().pipe(
    map((response) => {
      if (response.data === true) {
        return true;
      }

      toast.warning(
        'Please complete your first deposit and configure your external wallet address before applying for a card.',
      );
      return router.createUrlTree(['/home/wallet']);
    }),
    catchError(() => {
      toast.error('Unable to verify your wallet eligibility. Please try again.');
      return of(router.createUrlTree(['/home/wallet']));
    }),
  );
};
