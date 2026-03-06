import { Component, inject } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { buildSampleRechargeRecords, buildSampleTransferRecords } from '../../utils/sample.util';

@Component({
  selector: 'app-wallet-component',
  standalone: true,
  imports: [CountUpDirective, ReactiveFormsModule, CommonModule],
  templateUrl: './wallet.component.html',
})
export class WalletComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    checkAllRecharge: [false],
    checkAllTransfer: [false],

    rechargeRows: this.fb.array([]),
    transferRows: this.fb.array([]),
  });

  constructor() {
    this.initData();
  }

  /* ------------------- GETTERS ------------------- */

  get rechargeRows(): FormArray {
    return this.form.get('rechargeRows') as FormArray;
  }

  get transferRows(): FormArray {
    return this.form.get('transferRows') as FormArray;
  }

  /* ------------------- INIT DATA ------------------- */

  private initData() {
    // Recharge records
    buildSampleRechargeRecords.forEach((item) => {
      this.rechargeRows.push(
        this.fb.group({
          selected: false,
          orderNumber: item.orderNumber,
          currency: item.currency,
          channel: item.channel,
          amount: item.amount,
          state: item.state,
          reason: item.reason,
          remark: item.remark,
          creationTime: item.creationTime,
        }),
      );
    });

    // Transfer records
    buildSampleTransferRecords.forEach((item) => {
      this.transferRows.push(
        this.fb.group({
          selected: false,
          transferOutAccount: item.transferOutAccount,
          transferToAccount: item.transferToAccount,
          transferAmount: item.transferAmount,
          remark: item.remark,
          creationTime: item.creationTime,
        }),
      );
    });
  }
}
