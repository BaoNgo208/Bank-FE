import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ProfileService } from '../../../features/profile/services/profile.service';
import {
  ChangePasswordRequest,
  UserProfileResponse,
} from '../../../features/profile/types/profile.type';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-navigation-component',
  standalone: true,
  imports: [CommonModule, ChangePasswordModalComponent],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private elementRef = inject(ElementRef);
  private profileService = inject(ProfileService);

  @Output() toggleSidebar = new EventEmitter<void>();

  profile = signal<UserProfileResponse | null>(null);
  loadingProfile = signal(false);
  profileDropdownOpen = signal(false);

  showChangePasswordModal = signal(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.profileDropdownOpen.set(false);
    }
  }

  loadProfile(): void {
    this.loadingProfile.set(true);

    this.profileService.getUserProfile().subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.loadingProfile.set(false);
      },
      error: (err) => {
        this.loadingProfile.set(false);
        this.toast.error(err?.error?.message || 'Cannot load profile');
      },
    });
  }

  toggleProfileDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.profileDropdownOpen.update((value) => !value);
  }

  closeProfileDropdown(): void {
    this.profileDropdownOpen.set(false);
  }

  getAvatarText(): string {
    const username = this.profile()?.username || 'U';
    return username.charAt(0).toUpperCase();
  }

  handleUserChangePassword = (request: ChangePasswordRequest) => {
    return this.profileService.changePassword(request);
  };

  formatCreatedAt(value?: string): string {
    if (!value) return '-';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  }

  openChangePassword() {
    this.profileDropdownOpen.set(false);
    this.showChangePasswordModal.set(true);
  }

  closeChangePassword() {
    this.showChangePasswordModal.set(false);
  }

  logout(): void {
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
