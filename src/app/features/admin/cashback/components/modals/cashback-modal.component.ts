import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cashback-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cashback-modal.component.html',
})
export class CashbackModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() mode: 'create' | 'update' = 'create';
  @Input() data: any | null = null;

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form = this.fb.group({
    min_spent: [null as number | null, [Validators.min(0)]],
    max_spent: [null as number | null, [Validators.min(1)]],
    cashback_percent: [null as number | null, [Validators.min(0.1), Validators.max(100)]],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible']?.currentValue === true) {
      this.form.reset();

      const minSpentCtrl = this.form.get('min_spent');
      const cashbackCtrl = this.form.get('cashback_percent');

      if (this.mode === 'create') {
        minSpentCtrl?.addValidators(Validators.required);
        cashbackCtrl?.addValidators(Validators.required);
      } else {
        minSpentCtrl?.removeValidators(Validators.required);
        cashbackCtrl?.removeValidators(Validators.required);
      }

      minSpentCtrl?.updateValueAndValidity();
      cashbackCtrl?.updateValueAndValidity();

      if (this.data) {
        this.form.patchValue(this.data);
      }
    }
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}
