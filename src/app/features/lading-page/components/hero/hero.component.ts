import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { NavigateService } from '../../../../shared/services/navigate.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.componet.scss',
})
export class HeroComponent {
  protected navigateService = inject(NavigateService);
}
