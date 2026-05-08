import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navigation-component',
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private toast = inject(ToastrService);

  @Output() toggleSidebar = new EventEmitter<void>();

  logout() {
    this.authService.logout().subscribe({
      next: (_) => {
        this.authStore.clearAuth();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });
  }
}
