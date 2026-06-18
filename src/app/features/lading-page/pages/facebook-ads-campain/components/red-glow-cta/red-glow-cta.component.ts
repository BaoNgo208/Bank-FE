import { Component, inject } from '@angular/core';
import { NavigateService } from '../../../../../../shared/services/navigate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-red-glow-cta',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './red-glow-cta.component.html',
})
export class RedGlowCtaComponent {
  protected navigateService = inject(NavigateService);
}
