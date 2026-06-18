import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-why-tiktok-vcc',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './why-tiktok-vcc.component.html',
})
export class WhyTiktokVccComponent {}
