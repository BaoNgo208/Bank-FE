import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CashbackStore } from '../../stores/cashback.store';

@Component({
  selector: 'app-cashback-modal',
  imports: [CommonModule],
  templateUrl: './cashback-modal.component.html',
})
export class CashbackModalComponent {
  tab: 'overview' | 'history' | 'transactions' = 'overview';
  cashback = 13.65;

  protected cashbackStore = inject(CashbackStore);
}
