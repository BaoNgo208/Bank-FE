import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  @Input() content: string = 'Are you sure?';

  @Input() visible: boolean = false;

  @Input() onConfirm!: () => void;

  @Output() cancel = new EventEmitter<void>();

  handleConfirm() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.handleClose();
  }

  handleClose() {
    this.cancel.emit();
  }
}
