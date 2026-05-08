import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PublicNotificationService } from './services/public-notification.service';
import { NotificationService } from './services/notification.service';
import Swal from 'sweetalert2';
import { AnnouncementResponse } from './types/notification.type';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AnnouncementFormModalComponent } from './components/create-announcement-modal/announcement-form-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-notificiation-management-component',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PaginationComponent,
    AnnouncementFormModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './notification-management.component.html',
})
export class NotificationManagementComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);
  private publicNotiService = inject(PublicNotificationService);
  private notiService = inject(NotificationService);

  announcementModalMode = signal<'create' | 'update'>('create');
  showAnnouncementModal = signal<boolean>(false);
  showUpdateModal = signal<boolean>(false);
  selectedAnnouncement = signal<AnnouncementResponse | null>(null);

  showConfirmModal = signal<boolean>(false);

  notiPage = 1;
  notiPageSize = 10;
  notiTotalItems = 0;

  openDropdownIndex: number | null = null;
  dropdownPosition = { top: 0, left: 0 };

  form = this.fb.group({
    rows: this.fb.array([]),
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit() {
    this.loadNotis();
  }

  openLink(url: string | null | undefined): void {
    if (!url) return;

    const finalUrl =
      url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  }

  copyImageUrlsRecord(value: string | null | undefined) {
    if (!value) return;

    navigator.clipboard.writeText(value);

    this.toast.success('Copied to clipboard');
  }

  handleConfirmUpdate = () => {
    const index = this.openDropdownIndex;

    console.log('index:', index);

    if (index === null || index === undefined) return;

    const row = this.rows.at(index);
    console.log(row);

    const id = row.get('id')?.value;
    this.notiService.deleteAnnouncement(id).subscribe({
      next: (_) => {
        this.rows.removeAt(index);

        this.notiTotalItems = Math.max(0, this.notiTotalItems - 1);

        this.openDropdownIndex = null;
        this.showConfirmModal.set(false);

        this.cd.markForCheck();

        this.toast.success('Delete notification successfully');
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });
  };

  openUpdateAnnouncementModal(index: number) {
    const row = this.rows.at(index);

    const announcement: AnnouncementResponse = {
      id: row.get('id')?.value,
      title: row.get('title')?.value,
      content: row.get('content')?.value,
      link_url: row.get('link_url')?.value,
      is_active: row.get('is_active')?.value,
      created_at: row.get('created_at')?.value,
      updated_at: row.get('updated_at')?.value,
    };

    this.announcementModalMode.set('update');
    this.selectedAnnouncement.set(announcement);
    this.openDropdownIndex = null;
    this.showAnnouncementModal.set(true);
  }

  toggleDropdown(i: number, event: MouseEvent) {
    event.stopPropagation();
    console.log(i);

    if (this.openDropdownIndex === i) {
      this.openDropdownIndex = null;
      return;
    }

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const dropdownWidth = 160;
    const dropdownHeight = 160;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const top =
      spaceBelow < dropdownHeight && spaceAbove > spaceBelow
        ? rect.top - dropdownHeight
        : rect.bottom;

    this.dropdownPosition = {
      top,
      left: rect.right - dropdownWidth,
    };
    this.openDropdownIndex = i;
  }

  onAnnouncementSaved(item: AnnouncementResponse) {
    this.showAnnouncementModal.set(false);

    if (this.announcementModalMode() === 'create') {
      this.rows.insert(0, this.createAnnouncementRow(item));
      this.notiTotalItems += 1;
    } else {
      const index = this.rows.controls.findIndex((row) => row.get('id')?.value === item.id);

      if (index !== -1) {
        this.rows.at(index).patchValue({
          id: item.id,
          title: item.title,
          content: item.content,
          link_url: item.link_url,
          created_at: item.created_at,
          updated_at: item.updated_at,
        });
      }
    }

    this.cd.markForCheck();
  }

  createAnnouncementRow(item: AnnouncementResponse) {
    return this.fb.group({
      id: [item.id],
      title: [item.title],
      content: [item.content],
      link_url: [item.link_url],
      is_active: [item.is_active],
      created_at: [item.created_at],
      updated_at: [item.updated_at],
    });
  }

  onNotiPageChange(page: number): void {
    this.notiPage = page;
    this.loadNotis();
  }

  onNotiPageSizeChange(size: number) {
    this.notiPageSize = size;
    this.notiPage = 1;
    this.loadNotis();
  }

  private loadNotis() {
    this.publicNotiService.getAnnouncements(this.notiPage - 1).subscribe({
      next: (res) => {
        const content = res.data.items;
        this.notiTotalItems = res.data.total_size;

        this.rows.clear();
        content.forEach((item: AnnouncementResponse) => this.rows.push(this.fb.group({ ...item })));
        this.cd.detectChanges();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message,
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
