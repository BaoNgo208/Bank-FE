import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepositAdressFacade } from '../facades/deposit-address.facade';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deposit-address-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './deposit-address.component.html',
})
export class DepositAddressComponent {
  private fb = inject(FormBuilder);
  private depositAdressFacade = inject(DepositAdressFacade);
  private toast = inject(ToastrService);

  form = this.fb.group({
    currency: ['USDT', Validators.required],
    display_order: [1, Validators.required],
    network: ['', [Validators.required, Validators.maxLength(20)]],
    address: ['', [Validators.required, Validators.maxLength(255)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as any;

    this.depositAdressFacade.createDepositAddress(payload).subscribe({
      next: (res) => {
        console.log('Created:', res.data);
        this.toast.success('Successfully create deposit address');
        this.form.reset({
          currency: 'USDT',
          display_order: 1,
          network: '',
          address: '',
        });
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });
  }
}
