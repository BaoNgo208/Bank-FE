import { Component, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';

@Component({
  selector: 'app-front-page-component',
  imports: [CountUpDirective],
  templateUrl: './front-page.component.html',
})
export class FrontPageComponent {}
