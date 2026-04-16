import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletFacade } from '../../../features/wallet/facades/wallet.facade';

@Component({
  selector: 'app-otp-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-modal.component.html',
})
export class OtpModalComponent implements OnChanges {
  @Input() length: number = 6;

  @Input() orderNo!: string;

  @Input() visible: boolean = false;

  @Output() confirm = new EventEmitter<string>();

  @Output() cancel = new EventEmitter<void>();

  @ViewChildren('otpInput') inputRefs!: QueryList<ElementRef<HTMLInputElement>>;

  private walletFacade = inject(WalletFacade);

  otpValues: string[] = [];
  errorMsg = '';

  get isComplete(): boolean {
    return this.otpValues.length === this.length && this.otpValues.every((v) => v !== '');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['length'] || changes['visible']) {
      this.reset();
    }
  }

  reset(): void {
    this.otpValues = Array(this.length).fill('');
    this.errorMsg = '';
    setTimeout(() => this.focusIndex(0), 50);
  }

  private focusIndex(i: number): void {
    this.inputRefs?.toArray()[i]?.nativeElement.focus();
  }

  // Xoá hàm onInput cũ, thay bằng onKeyDown xử lý hết

  onKeyDown(event: KeyboardEvent, idx: number): void {
    const key = event.key;

    // Chặn mọi ký tự không phải số / điều hướng
    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    if (!/^\d$/.test(key) && !allowed.includes(key)) {
      event.preventDefault();
      return;
    }

    if (/^\d$/.test(key)) {
      event.preventDefault();
      const values = [...this.otpValues];
      values[idx] = key;
      this.otpValues = values;
      this.errorMsg = '';
      if (idx < this.length - 1) {
        setTimeout(() => this.focusIndex(idx + 1), 0);
      }
    }

    if (key === 'Backspace') {
      event.preventDefault();
      const values = [...this.otpValues];
      if (values[idx]) {
        values[idx] = '';
        this.otpValues = values;
      } else if (idx > 0) {
        this.focusIndex(idx - 1);
      }
    }

    if (key === 'ArrowLeft' && idx > 0) this.focusIndex(idx - 1);
    if (key === 'ArrowRight' && idx < this.length - 1) this.focusIndex(idx + 1);
    if (key === 'Enter' && this.isComplete) this.onConfirmClick();
  }

  onPaste(event: ClipboardEvent, startIdx: number): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    const values = [...this.otpValues];
    for (let i = 0; i < text.length && startIdx + i < this.length; i++) {
      values[startIdx + i] = text[i];
    }
    this.otpValues = values;
    const nextFocus = Math.min(startIdx + text.length, this.length - 1);
    setTimeout(() => this.focusIndex(nextFocus), 0);
  }

  onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  onConfirmClick(): void {
    if (!this.isComplete) return;
    console.log(this.otpValues.join(''));
    this.confirm.emit(this.otpValues.join(''));
  }

  onCancel(): void {
    this.reset();
    this.cancel.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    this.onCancel();
  }

  onResend(): void {
    this.walletFacade.resendWithdrawOtp(this.orderNo).subscribe({
      next: (res) => {},
      error: (err) => {},
    });
    this.reset();
  }
}
