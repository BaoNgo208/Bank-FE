import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about-wallet-component',
  imports: [TranslatePipe],
  templateUrl: './about-wallet.component.html',
})
export class AboutWalletComponent {}
