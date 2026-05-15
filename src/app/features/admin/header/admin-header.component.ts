import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProfileService } from '../../profile/services/admin-profile.service';
import { AdminProfileResponse, ChangePasswordRequest } from '../../profile/types/profile.type';
import { ChangePasswordModalComponent } from '../../../shared/components/nav/components/change-password-modal/change-password-modal/change-password-modal.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, ChangePasswordModalComponent],
  templateUrl: './admin-header.component.html',
})
export class AdminHeaderComponent implements OnInit {
  private adminProfileService = inject(AdminProfileService);
  private router = inject(Router);
  private authService = inject(AuthService);

  loadingProfile = signal(false);
  profile = signal<AdminProfileResponse | null>(null);

  profileDropdownOpen = signal(false);
  showChangePasswordModal = signal(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loadingProfile.set(true);

    this.adminProfileService.getAdminProfile().subscribe({
      next: (res) => {
        console.log('ADMIN PROFILE RESPONSE:', res);

        this.profile.set(res.data);
        this.loadingProfile.set(false);
      },
      error: (err) => {
        console.error('ADMIN PROFILE ERROR:', err);

        this.loadingProfile.set(false);
        this.profile.set(null);
      },
    });
  }

  toggleProfileDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.profileDropdownOpen.update((value) => !value);
  }

  handleAdminChangePassword = (request: ChangePasswordRequest) => {
    return this.adminProfileService.changePassword(request);
  };

  openChangePassword(): void {
    this.profileDropdownOpen.set(false);
    this.showChangePasswordModal.set(true);
  }

  closeChangePassword(): void {
    this.showChangePasswordModal.set(false);
  }

  getAvatarText(username?: string): string {
    if (!username) return 'A';

    return username.trim().charAt(0).toUpperCase();
  }

  logout(): void {
    this.profileDropdownOpen.set(false);

    this.authService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/admin/login']);
      },
    });
  }

  @HostListener('document:click')
  closeDropdownOnOutsideClick(): void {
    this.profileDropdownOpen.set(false);
  }
}
