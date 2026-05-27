import { Component, inject } from '@angular/core';
import { NavigateService } from '../../../../shared/services/navigate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ads-card-component',
  imports: [TranslatePipe],
  templateUrl: './ads-card.component.html',
  styleUrl: './ads-card.component.scss',
})
export class AdsCardComponent {
  protected navigateService = inject(NavigateService);
}
