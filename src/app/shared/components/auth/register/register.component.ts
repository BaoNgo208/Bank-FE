import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpPurpose, OtpRequest, SignupRequest } from '../../../../core/auth/auth.request';
import { AuthService } from '../../../../core/auth/auth.service';
import { OtpService } from '../../../../core/auth/otp.service';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private otpService = inject(OtpService);
  private toast = inject(ToastrService);

  registerForm = this.fb.nonNullable.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      otp: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  onSubmit() {
    if (this.registerForm.hasError('passwordMismatch')) {
      Swal.fire({
        icon: 'error',
        title: 'Password mismatch',
        text: 'Password and Confirm Password do not match',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid form',
        text: 'Please fill all required fields',
      });
      return;
    }

    const data: SignupRequest = this.registerForm.getRawValue();

    this.authService.signup(data).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.toast.success('created account successfully!');
      },
      error: (err) => {
        const message = err?.error?.message ?? 'Something went wrong';

        Swal.fire({
          icon: 'error',
          title: 'Register failed',
          text: message,
          confirmButtonText: 'OK',
        });
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
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: 'OTP has been sent to your email',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Send OTP Failed',
          text: err?.error?.message ?? 'Something went wrong',
        });
      },
    });
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
