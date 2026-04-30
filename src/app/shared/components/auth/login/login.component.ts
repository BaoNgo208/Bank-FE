import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { SigninRequest } from '../../../../core/auth/auth.request';
import { AuthStore } from '../../../../core/auth/auth.store';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    emailCode: [''],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const data: SigninRequest = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? '',
    };

    this.authService.signIn(data).subscribe({
      next: (res) => {
        this.authStore.setTokens(res.tokens.access_token, res.tokens.refresh_token);
        this.router.navigate(['/home']);
      },
    });
  }

  redirectToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
