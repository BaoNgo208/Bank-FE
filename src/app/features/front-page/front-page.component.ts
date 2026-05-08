import { Component, signal, inject } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { CommonModule } from '@angular/common';
import { WalletFacade } from '../wallet/facades/wallet.facade';
import { DashboardResponse } from '../wallet/types/wallet.type';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementResponse } from '../admin/notification-management/types/notification.type';
import { PublicNotificationService } from '../admin/notification-management/services/public-notification.service';

@Component({
  selector: 'app-front-page-component',
  imports: [CountUpDirective, CommonModule],
  templateUrl: './front-page.component.html',
})
export class FrontPageComponent {
  private walletFacade = inject(WalletFacade);
  private toast = inject(ToastrService);
  private publicNotiService = inject(PublicNotificationService);

  dashboard = signal<DashboardResponse | null>(null);
  announcements = signal<AnnouncementResponse[]>([]);

  announcementPage = signal(0);
  hasNextAnnouncement = signal(true);
  loadingMoreAnnouncements = signal(false);
  loadingAnnouncements = signal(false);

  ngOnInit() {
    this.walletFacade.getDashboard().subscribe({
      next: (res) => {
        this.dashboard.set(res.data);
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });

    this.publicNotiService.getAnnouncements().subscribe({
      next: (res) => {
        this.announcements.set(res.data.items);
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });
  }

  onAnnouncementScroll(event: Event) {
    const el = event.target as HTMLElement;

    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    if (!isBottom) return;
    if (this.loadingMoreAnnouncements() || this.loadingAnnouncements()) return;
    if (!this.hasNextAnnouncement()) return;

    this.loadMoreAnnouncements();
  }

  loadMoreAnnouncements() {
    this.loadingMoreAnnouncements.set(true);

    const nextPage = this.announcementPage() + 1;

    this.publicNotiService.getAnnouncements(nextPage).subscribe({
      next: (res) => {
        const data = res.data;

        this.announcements.update((current) => [...current, ...(data.items ?? [])]);

        this.announcementPage.set(nextPage);
        this.hasNextAnnouncement.set(data.has_next);
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
      complete: () => {
        this.loadingMoreAnnouncements.set(false);
      },
    });
  }
}
