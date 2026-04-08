import { Component, NgZone, OnInit, ChangeDetectorRef, signal, inject } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { AnnouncementItem, ANNOUNCEMENTS_MOCK } from '../../utils/sample.util';
import { CommonModule } from '@angular/common';
import { WalletFacade } from '../wallet/facades/wallet.facade';

@Component({
  selector: 'app-front-page-component',
  imports: [CountUpDirective, CommonModule],
  templateUrl: './front-page.component.html',
})
export class FrontPageComponent {
  private walletFacade = inject(WalletFacade);

  totalAsset = signal<number>(0.0);
  announcements = signal<AnnouncementItem[]>(ANNOUNCEMENTS_MOCK);

  ngOnInit() {
    this.walletFacade.getBalance().subscribe({
      next: (res) => {
        this.totalAsset.set(res.data.wallet_balance);
      },
      error: (_) => {},
    });
  }
}
