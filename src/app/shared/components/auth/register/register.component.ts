import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm = this.fb.group({});

  onSubmit() {}

  redirectToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
