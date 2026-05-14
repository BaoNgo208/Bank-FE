import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WalletCurrencySettingService } from './services/wallet-currency.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import {
  UpdateWalletCurrencySettingsRequest,
  WalletCurrencySettingsResponse,
} from './types/wallet-currency.type';
import { Stablecoin } from '../../wallet/types/wallet.type';

@Component({
  selector: 'app-wallet-currency-compnent',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './wallet-currency.component.html',
})
export class WalletCurrencyComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);
  private service = inject(WalletCurrencySettingService);

  currencyPage = 1;
  currencyPageSize = 10;
  currencyTotalItems = 0;

  openDropdownIndex: number | null = null;
  dropdownPosition = { top: 0, left: 0 };

  showUpdateModal = false;
  updating = false;
  selectedSettingId: number | null = null;
  selectedRowIndex: number | null = null;

  form = this.fb.group({
    rows: this.fb.array([]),
  });

  updateForm = this.fb.group({
    currency: ['', Validators.required],
    deposit_fee_percent: ['', [Validators.required, Validators.min(0)]],
    min_deposit_amount: ['', [Validators.required, Validators.min(0.000001)]],
    min_withdraw_amount: ['', [Validators.required, Validators.min(0.000001)]],
    min_card_funding_amount: ['', [Validators.required, Validators.min(0.000001)]],
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit() {
    this.service.getAllSettings().subscribe({
      next: (res) => {
        const content = res.data;

        content.forEach((item: WalletCurrencySettingsResponse) => {
          this.rows.push(this.fb.group(item));
        });

        this.cd.detectChanges();
      },
      error: (err) => {
        this.toast.error(err?.error?.message);
      },
    });
  }

  toggleDropdown(i: number, event: MouseEvent) {
    event.stopPropagation();

    if (this.openDropdownIndex === i) {
      this.openDropdownIndex = null;
      return;
    }

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();

    const dropdownWidth = 240;
    const dropdownHeight = 80;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const top =
      spaceBelow < dropdownHeight && spaceAbove > spaceBelow
        ? rect.top - dropdownHeight
        : rect.bottom;

    this.dropdownPosition = {
      top,
      left: rect.right - dropdownWidth,
    };

    this.openDropdownIndex = i;
  }

  openUpdateModal() {
    const index = this.openDropdownIndex;

    if (index === null || index === undefined) return;

    const row = this.rows.at(index);
    const value = row.getRawValue() as WalletCurrencySettingsResponse;

    this.selectedSettingId = value.id;
    this.selectedRowIndex = index;

    this.updateForm.patchValue({
      currency: value.currency,
      deposit_fee_percent: value.deposit_fee_percent,
      min_deposit_amount: value.min_deposit_amount,
      min_withdraw_amount: value.min_withdraw_amount,
      min_card_funding_amount: value.min_card_funding_amount,
    });

    this.showUpdateModal = true;
    this.openDropdownIndex = null;
  }

  closeUpdateModal() {
    if (this.updating) return;

    this.showUpdateModal = false;
    this.selectedSettingId = null;
    this.selectedRowIndex = null;
    this.updateForm.reset();
  }

  submitUpdate() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    if (this.selectedSettingId === null || this.selectedRowIndex === null) return;

    const raw = this.updateForm.getRawValue();

    const payload: UpdateWalletCurrencySettingsRequest = {
      currency: raw.currency as Stablecoin,
      deposit_fee_percent: String(raw.deposit_fee_percent),
      min_deposit_amount: String(raw.min_deposit_amount),
      min_withdraw_amount: String(raw.min_withdraw_amount),
      min_card_funding_amount: String(raw.min_card_funding_amount),
    };

    this.updating = true;

    this.service
      .updateSettings(this.selectedSettingId, payload)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (res) => {
          const index = this.selectedRowIndex;

          if (index === null) return;

          this.rows.at(index).patchValue(res.data, { emitEvent: false });

          this.showUpdateModal = false;
          this.selectedSettingId = null;
          this.selectedRowIndex = null;
          this.updateForm.reset();

          this.cd.detectChanges();

          setTimeout(() => {
            this.toast.success('Update wallet currency setting successfully');
          });
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Update failed');
        },
      });
  }

  isInvalid(controlName: string): boolean {
    const control = this.updateForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
