import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InquiryUiStore } from '../../stores/inquiry-ui.store';

@Component({
  selector: 'app-cashback-component',
  imports: [CommonModule],
  templateUrl: './cashback.component.html',
})
export class CashbackComponent {
  tab: 'overview' | 'history' | 'transactions' = 'overview';
  cashback = 13.65;

  protected inquiryUiStore = inject(InquiryUiStore);
}
