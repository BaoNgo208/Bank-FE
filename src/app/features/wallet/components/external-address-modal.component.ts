import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { WalletAccessService } from '../services/wallet-access.service';
import { CryptoNetwork, Stablecoin } from '../types/wallet.type';

@Component({
  selector: 'app-external-address-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './external-address-modal.component.html',
})
export class ExternalAddressModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastrService);
  private readonly walletAccessService = inject(WalletAccessService);

  @Output() readonly created = new EventEmitter<void>();
  @Output() readonly cancelled = new EventEmitter<void>();

  readonly submitting = signal(false);
  readonly showConfirmModal = signal(false);
  readonly Stablecoin = Stablecoin;
  readonly CryptoNetwork = CryptoNetwork;

  readonly form = this.fb.nonNullable.group({
    currency: [Stablecoin.USDT, Validators.required],
    network: [CryptoNetwork.TRC20, Validators.required],
    address: ['', [Validators.required, Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    this.form.controls.currency.valueChanges.subscribe((currency) => {
      const network = currency === Stablecoin.USDC ? CryptoNetwork.BASE : CryptoNetwork.TRC20;
      this.form.controls.network.setValue(network);
    });
  }

  get availableNetworks(): CryptoNetwork[] {
    return this.form.controls.currency.value === Stablecoin.USDC
      ? [CryptoNetwork.BASE]
      : [CryptoNetwork.TRC20, CryptoNetwork.BEP20];
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const address = value.address.trim();

    if (!address) {
      this.form.controls.address.setErrors({ required: true });
      return;
    }

    this.showConfirmModal.set(true);
  }

  readonly confirmSubmit = (): void => {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    const value = this.form.getRawValue();
    const address = value.address.trim();

    if (!address) {
      this.form.controls.address.setErrors({ required: true });
      return;
    }

    this.submitting.set(true);
    this.walletAccessService
      .createExternalAddress({ ...value, address })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Wallet address configured successfully.');
          this.created.emit();
        },
        error: (error) => {
          this.toast.error(error?.error?.message || 'Unable to configure wallet address.');
        },
      });
  };

  cancel(): void {
    if (!this.submitting()) {
      this.cancelled.emit();
    }
  }
}
