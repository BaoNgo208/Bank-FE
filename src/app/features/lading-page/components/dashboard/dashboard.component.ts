import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-dashboard',
  imports: [TranslatePipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
