import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardSensitiveDetailResponse } from '../../types/type';

@Component({
  selector: 'app-card-sensitive-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-sensitive-detail-modal.component.html',
})
export class CardSensitiveDetailModalComponent {
  @Input({ required: true }) card!: CardSensitiveDetailResponse;
  @Output() close = new EventEmitter<void>();

  showSensitive = signal(false);

  toggleSensitive() {
    this.showSensitive.update((v) => !v);
  }

  maskPan(pan: string) {
    if (!pan) return '•••• •••• •••• ••••';

    const clean = pan.replace(/\s/g, '');
    const last4 = clean.slice(-4);

    return `•••• •••• •••• ${last4}`;
  }

  formatPan(pan: string) {
    if (!pan) return '-';

    return pan.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(month: number, year: number) {
    const mm = String(month).padStart(2, '0');
    return `${mm}/${year}`;
  }

  formatDate(value: string) {
    if (!value) return '-';

    return new Date(value).toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  copy(value: string | number | null | undefined) {
    if (value === null || value === undefined) return;

    navigator.clipboard.writeText(String(value));
  }
}
