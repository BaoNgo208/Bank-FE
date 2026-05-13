import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

import { AdminAuthService } from '../../../../core/auth/admin-auth.service';
import { AuthStore } from '../../../../core/auth/auth.store';
import { ToastrService } from 'ngx-toastr';
import { AdminSigninRequest } from '../../../../core/auth/auth.request';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private adminAuthService = inject(AdminAuthService);
  private authStore = inject(AuthStore);
  private toast = inject(ToastrService);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  requestingOtp = signal(false);
  otpRequested = signal(false);
  submitting = signal(false);

  isInvalid(controlName: 'username' | 'password' | 'otp'): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: 'username' | 'password' | 'otp'): string {
    const control = this.loginForm.get(controlName);

    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      if (controlName === 'username') return 'Username is required';
      if (controlName === 'password') return 'Password is required';
      if (controlName === 'otp') return 'OTP is required';
    }

    if (control.hasError('minlength')) {
      if (controlName === 'password') return 'Password must be at least 6 characters';
      if (controlName === 'otp') return 'OTP must be 6 digits';
    }

    if (control.hasError('maxlength')) {
      if (controlName === 'otp') return 'OTP must be 6 digits';
    }

    return '';
  }

  requestOtp() {
    const username = this.loginForm.get('username')?.value?.trim();

    if (!username) {
      this.loginForm.get('username')?.markAsTouched();
      this.toast.error('Please enter username first');
      return;
    }

    this.requestingOtp.set(true);

    this.adminAuthService
      .requestLoginOtp({ username })
      .pipe(finalize(() => this.requestingOtp.set(false)))
      .subscribe({
        next: () => {
          this.otpRequested.set(true);
          this.toast.success('OTP has been sent to admin email');
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Failed to request OTP');
        },
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const raw = this.loginForm.getRawValue();

    const data: AdminSigninRequest = {
      username: raw.username!.trim(),
      password: raw.password!,
      otp: raw.otp!.trim(),
    };

    this.submitting.set(true);

    this.adminAuthService
      .signIn(data)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (res) => {
          this.authStore.setTokens(res.tokens.access_token, res.tokens.refresh_token);
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Login failed');
        },
      });
  }

  redirectToRegister() {
    this.router.navigate(['/admin/auth/register']);
  }
}
