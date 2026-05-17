import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';

export type LandingSection = 'about' | 'features' | 'pricing';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private router = inject(Router);
  @Output() navClick = new EventEmitter<LandingSection>();

  goToSection(section: LandingSection) {
    this.navClick.emit(section);
  }
  goToAuth() {
    const hasToken = !!localStorage.getItem('accessToken');

    this.router.navigate([hasToken ? '/home' : '/auth/login']);
  }
}
