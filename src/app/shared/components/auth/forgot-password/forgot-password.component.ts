import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { OtpService } from '../../../../core/auth/otp.service';
import { ResetPasswordRequest } from '../../../../core/auth/auth.request';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private otpService = inject(OtpService);

  submitting = signal(false);
  sendingOtp = signal(false);
  otpSent = signal(false);

  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  forgotPasswordForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/),
      ],
    ],
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(72),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
      ],
    ],
    confirmNewPassword: ['', [Validators.required]],
  });

  sendOtp() {
    const usernameControl = this.forgotPasswordForm.get('username');

    usernameControl?.markAsTouched();

    if (!usernameControl || usernameControl.invalid) {
      return;
    }

    const username = usernameControl.value!.trim();

    this.sendingOtp.set(true);

    this.otpService
      .requestResetOtp({ username })
      .pipe(finalize(() => this.sendingOtp.set(false)))
      .subscribe({
        next: () => {
          this.otpSent.set(true);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const raw = this.forgotPasswordForm.getRawValue();

    if (raw.newPassword !== raw.confirmNewPassword) {
      this.forgotPasswordForm.get('confirmNewPassword')?.setErrors({
        passwordMismatch: true,
      });
      return;
    }

    const payload: ResetPasswordRequest = {
      username: raw.username!.trim(),
      otp: raw.otp!.trim(),
      new_password: raw.newPassword!,
      confirm_new_password: raw.confirmNewPassword!,
    };

    this.submitting.set(true);

    this.authService
      .resetPassword(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }

  isInvalid(controlName: string): boolean {
    const control = this.forgotPasswordForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
