import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProfileService } from '../../../../../../features/profile/services/profile.service';
import { ChangePasswordRequest } from '../../../../../../features/profile/types/profile.type';
import { AuthStore } from '../../../../../../core/auth/auth.store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../../core/auth/auth.request';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input({ required: true })
  changePassword!: (request: ChangePasswordRequest) => Observable<ApiResponse<void>>;
  @Input() loginPath = '/auth/login';

  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  loading = signal(false);

  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  form = this.fb.group(
    {
      current_password: ['', [Validators.required]],
      new_password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,100}$/),
        ],
      ],
      confirm_new_password: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  private passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('new_password')?.value;
    const confirmPassword = control.get('confirm_new_password')?.value;

    if (!newPassword || !confirmPassword) return null;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  get currentPassword() {
    return this.form.get('current_password');
  }

  get newPassword() {
    return this.form.get('new_password');
  }

  get confirmNewPassword() {
    return this.form.get('confirm_new_password');
  }

  onClose() {
    if (this.loading()) return;
    this.close.emit();
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.changePassword) return;

    const payload = this.form.getRawValue() as ChangePasswordRequest;

    this.loading.set(true);

    this.changePassword(payload).subscribe({
      next: () => {
        this.loading.set(false);

        Swal.fire({
          icon: 'success',
          title: 'Password changed',
          text: 'Your password has been updated successfully.',
          confirmButtonColor: '#ef4444',
        });

        this.authStore.clearAuth();
        this.close.emit();
        this.router.navigate([this.loginPath]);
      },
      error: (err) => {
        this.loading.set(false);

        const message =
          err?.error?.message ||
          err?.error?.error ||
          'Unable to change password. Please try again.';

        Swal.fire({
          icon: 'error',
          title: 'Change password failed',
          text: message,
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }
}
