import { Component, inject } from '@angular/core';
import { NavigateService } from '../../../../../../shared/services/navigate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-facebook-ad-overview',
  imports: [TranslatePipe],
  templateUrl: './overview.component.html',
})
export class OverviewComponent {
  protected navigateService = inject(NavigateService);
}
