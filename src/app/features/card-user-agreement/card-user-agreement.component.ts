import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-card-user-agreement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-user-agreement.component.html',
})
export class CardUserAgreementComponent {
  @Output() agree = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  accepted = signal(false);

  onAgree() {
    if (!this.accepted()) return;
    this.agree.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
