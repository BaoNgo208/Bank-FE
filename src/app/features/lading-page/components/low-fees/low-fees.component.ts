import { Component, inject } from '@angular/core';
import { NavigateService } from '../../../../shared/services/navigate.service';

@Component({
  selector: 'app-low-fees-section',
  standalone: true,
  imports: [],
  templateUrl: './low-fees.component.html',
})
export class LowFeesComponent {
  protected navigateService = inject(NavigateService);

  imageUrl =
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80';
}
