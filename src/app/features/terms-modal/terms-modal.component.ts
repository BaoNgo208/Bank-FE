import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { TermType } from '../../shared/pages/auth/auth.page';

@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-modal.component.html',
})
export class TermsModalComponent {
  @Input({ required: true }) termType!: TermType;

  @Output() agree = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get title() {
    return this.termType === 'privacy' ? 'Privacy Agreement' : 'Refund Agreement';
  }

  close() {
    this.cancel.emit();
  }

  confirm() {
    this.agree.emit();
  }
}
