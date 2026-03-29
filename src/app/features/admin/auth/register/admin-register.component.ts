import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpPurpose, OtpRequest, SignupRequest } from '../../../../core/auth/auth.request';
import { OtpService } from '../../../../core/auth/otp.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AdminAuthService } from '../../../../core/auth/admin-auth.service';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-register.component.html',
})
export class AdminRegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private adminAuthService = inject(AdminAuthService);
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

    // Todo : Call signup API and handle response
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
    this.router.navigate(['/admin/auth/login']);
  }
}
