import { Component, inject } from '@angular/core';
import { NavigateService } from '../../../../shared/services/navigate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-assets-component',
  imports: [TranslatePipe],
  templateUrl: './manage-assets.component.html',
})
export class ManageAssetsComponent {
  protected navigateService = inject(NavigateService);
}
