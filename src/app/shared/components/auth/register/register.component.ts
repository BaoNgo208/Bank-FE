import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpPurpose, OtpRequest, SignupRequest } from '../../../../core/auth/auth.request';
import { AuthService } from '../../../../core/auth/auth.service';
import { OtpService } from '../../../../core/auth/otp.service';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private otpService = inject(OtpService);

  registerForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    otp: ['', Validators.required],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('invalid');
      return;
    }

    const data: SignupRequest = this.registerForm.getRawValue();

    this.authService.signup(data).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
    });
  }

  sendOtp() {
    const email = this.registerForm.controls.email.value;

    if (!email) {
      alert('Please enter email first');
      return;
    }

    const request: OtpRequest = {
      email: email,
      purpose: OtpPurpose.SIGNUP,
    };

    this.otpService.requestOtp(request).subscribe({
      next: (res) => {
        console.log(res.message);
        alert('OTP sent to email');
      },
      error: (err) => {
        alert(err?.error?.message ?? 'Send OTP failed');
      },
    });
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
