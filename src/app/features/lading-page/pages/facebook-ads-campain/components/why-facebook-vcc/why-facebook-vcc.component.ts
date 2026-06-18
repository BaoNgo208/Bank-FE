import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-why-facebook-vcc',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './why-facebook-vcc.component.html',
})
export class WhyFacebookVccComponent {}
