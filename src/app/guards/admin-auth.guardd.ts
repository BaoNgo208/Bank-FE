import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.navigate(['admin/auth/login']);
    return false;
  }

  return true;
};
