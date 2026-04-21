import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private router = inject(Router);

  goToAuth() {
    const hasToken = !!localStorage.getItem('accessToken');

    this.router.navigate([hasToken ? '/home' : '/auth/login']);
  }
}
