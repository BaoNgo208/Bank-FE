import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { SigninRequest } from '../../../../core/auth/auth.request';
import { AdminAuthService } from '../../../../core/auth/admin-auth.service';
import { AuthStore } from '../../../../core/auth/auth.store';

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

    this.adminAuthService.signIn(data).subscribe({
      next: (res) => {
        this.authStore.setTokens(res.tokens.access_token, res.tokens.refresh_token);

        this.router.navigate(['/admin']);
      },
    });
  }

  redirectToRegister() {
    this.router.navigate(['/admin/auth/register']);
  }
}
