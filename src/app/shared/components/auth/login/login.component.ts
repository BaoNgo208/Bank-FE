import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { SigninRequest } from '../../../../core/auth/auth.request';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    emailCode: [''],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('invalid');
      return;
    }

    const data: SigninRequest = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? '',
    };

    this.authService.signIn(data).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.tokens.access_token);
        localStorage.setItem('refreshToken', res.tokens.refresh_token);
        this.router.navigate(['/home']);
      },
    });
  }

  redirectToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
