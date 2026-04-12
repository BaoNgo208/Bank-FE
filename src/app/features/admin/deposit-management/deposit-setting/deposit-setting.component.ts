import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { DepositSettingFacade } from '../facades/deposit-setting.facade';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deposit-setting-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './deposit-setting.component.html',
})
export class DepositSettingComponent {
  private fb = inject(FormBuilder);
  private facade = inject(DepositSettingFacade);
  private toast = inject(ToastrService);

  form = this.fb.group(
    {
      currency: ['USDT', Validators.required],
      fee_percent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      min_amount: [0, [Validators.required, Validators.min(0)]],
      max_amount: [null],
    },
    {
      validators: [this.maxGreaterThanMinValidator],
    },
  );

  // custom validator giống backend
  maxGreaterThanMinValidator(control: AbstractControl) {
    const min = control.get('min_amount')?.value;
    const max = control.get('max_amount')?.value;

    if (max == null || min == null) return null;

    return max >= min ? null : { maxInvalid: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.facade.createDepositSetting(this.form.value as any).subscribe({
      next: (res) => {
        console.log('Created:', res.data);
        this.toast.success('Successfully create deposit setting');
        this.form.reset({
          currency: 'USDT',
          fee_percent: 0,
          min_amount: 0,
          max_amount: null,
        });
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });
  }
}
