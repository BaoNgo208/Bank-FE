import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageSwitcherComponent } from '../../../../shared/components/language-switcher/language-switcher.component';
import { TranslatePipe } from '@ngx-translate/core';

export type LandingSection = 'about' | 'features' | 'pricing';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, LanguageSwitcherComponent, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Output() navClick = new EventEmitter<LandingSection>();

  private router = inject(Router);
  mobileMenuOpen = false;

  goToSection(section: LandingSection) {
    this.navClick.emit(section);
  }
  goToAuth() {
    const hasToken = !!localStorage.getItem('accessToken');

    this.router.navigate([hasToken ? '/home' : '/auth/login']);
  }
}
