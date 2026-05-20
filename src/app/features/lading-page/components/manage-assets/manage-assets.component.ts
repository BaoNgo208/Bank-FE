import { Component, inject } from '@angular/core';
import { NavigateService } from '../../../../shared/services/navigate.service';

@Component({
  selector: 'app-manage-assets-component',
  imports: [],
  templateUrl: './manage-assets.component.html',
})
export class ManageAssetsComponent {
  protected navigateService = inject(NavigateService);
}
