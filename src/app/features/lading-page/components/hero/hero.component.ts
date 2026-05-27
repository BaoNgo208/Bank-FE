import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { NavigateService } from '../../../../shared/services/navigate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective, TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.componet.scss',
})
export class HeroComponent {
  protected navigateService = inject(NavigateService);
}
