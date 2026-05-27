import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-features-list',
  imports: [TranslatePipe],
  templateUrl: './features.component.html',
})
export class FeaturesComponent {}
