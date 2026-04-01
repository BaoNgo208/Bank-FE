import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BINS, US_STATES } from '../../utils/constant';
import { CreateCardRequest } from '../wallet/types/wallet.type';
import { WalletFacade } from '../wallet/facades/wallet.facade';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apply-card-component',
  imports: [CommonModule],
  templateUrl: './apply-card.component.html',
})
export class ApplyCardComponent {
  private walletFacade = inject(WalletFacade);
  private toast = inject(ToastrService);

  usStates = US_STATES;
  bins: string[] = BINS;

  selectedBin: string | null = null;
  // form signals
  bin = signal<string>('');
  cardName = signal<string>('');
  amount = signal<number>(5);
  remark = signal<string>('');

  // holder signals
  firstName = signal<string>('');
  lastName = signal<string>('');
  addressLine = signal<string>('');
  city = signal<string>('');
  state = signal<string>('');
  postalCode = signal<string>('');
  country = signal<string>('US');

  payload = computed<CreateCardRequest>(() => ({
    bin: this.bin(),
    name: this.cardName(),
    amount: this.amount(),
    holder: {
      firstName: this.firstName(),
      lastName: this.lastName(),
      addressLine: this.addressLine(),
      city: this.city(),
      state: this.state(),
      postalCode: this.postalCode(),
      country: this.country(),
    },
  }));

  selectBin(bin: string) {
    this.selectedBin = bin;
    this.bin.set(bin);
  }

  onSubmit() {
    this.walletFacade.createCard(this.payload()).subscribe({
      next: (_) => {
        this.toast.success('Successfully created new card!');
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message,
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
