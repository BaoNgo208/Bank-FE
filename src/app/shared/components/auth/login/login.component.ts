import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    emailCode: [''],
  });

  onSubmit() {
    // if (this.loginForm.invalid) {return;}

    const formValue = this.loginForm.value;

    console.log(formValue);
    this.router.navigate(['/home']);
  }

  redirectToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
