import {
  Component,
  NgZone,
  OnInit,
  ChangeDetectorRef,
  signal,
  inject,
  effect,
} from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { AnnouncementItem, ANNOUNCEMENTS_MOCK } from '../../utils/sample.util';
import { CommonModule } from '@angular/common';
import { WalletFacade } from '../wallet/facades/wallet.facade';
import { DashboardResponse } from '../wallet/types/wallet.type';

@Component({
  selector: 'app-front-page-component',
  imports: [CountUpDirective, CommonModule],
  templateUrl: './front-page.component.html',
})
export class FrontPageComponent {
  private walletFacade = inject(WalletFacade);

  dashboard = signal<DashboardResponse | null>(null);
  announcements = signal<AnnouncementItem[]>(ANNOUNCEMENTS_MOCK);

  ngOnInit() {
    this.walletFacade.getDashboard().subscribe({
      next: (res) => {
        this.dashboard.set(res.data);
      },
      error: (_) => {},
    });
  }
}
