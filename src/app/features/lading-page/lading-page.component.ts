import { Component, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AdsCardComponent } from './components/ads-card/ads-card.component';
import { LowFeesComponent } from './components/low-fees/low-fees.component';
import { ManageAssetsComponent } from './components/manage-assets/manage-assets.component';
import { FeaturesComponent } from './components/features/features.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    NavbarComponent,
    HeroComponent,
    AdsCardComponent,
    LowFeesComponent,
    ManageAssetsComponent,
    FeaturesComponent,
    DashboardComponent,
  ],
  templateUrl: './landing-page.componet.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  private el = inject(ElementRef);
  private router = inject(Router);

  goToAuth() {
    const hasToken = !!localStorage.getItem('accessToken');
    const redirectUrl = hasToken ? '/home' : '/auth/login';
    this.router.navigate([redirectUrl]);
  }

  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll('.reveal');
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      setTimeout(() => {
        navbar.classList.add('show');
      }, 200);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    elements.forEach((el: Element) => observer.observe(el));
  }
}
